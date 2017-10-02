///<reference path="node_modules/reflect-metadata/reflect-metadata.d.ts"/>"
import * as getParameterNames from 'get-parameter-names';
import "reflect-metadata";

const CONSTRUCTOR_METADATA = Symbol('Constructors');

type Newable<T = any> = { new(...x: any[]): T };

type DeferredNewable<T = any> = () => Newable<T>;

const PRIMITIVE_CONVERSIONS = new Map<Newable, Function>([
  [Boolean, (v: any) => !!v],
  [Number, (v: any) => +v],
  [String, (v: any) => Helper.isUndefinedOrNull(v) ? '' : v + '']
]);

const PRIMITIVE_TYPES = new Map<string, Newable>([
  ["boolean", Boolean],
  ["number", Number],
  ["string", String]
]);

// TODO implement strict typing where every object has to be constructed
// const configuration = {
//   strict: false
// };

// TODO target environments
// Browser - (angular4)
// Node/Express ?
// ?



class Helper {

  static isUndefined(...args: any[]) {
    return args.some((o) => typeof o === 'undefined');
  }

  static isUndefinedOrNull(...args: any[]) {
    return args.some((o) => typeof o === 'undefined' || o === null);
  }

  static isMapOrSet(type: any): boolean {
    return [Map, WeakMap, Set, WeakSet].indexOf(type) > -1;
  }

  static excludeKeys(json: any, keys: string[]) {
    return Object.keys(json)
      .filter(key => !keys.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = json[key];
        return obj;
      }, {});
  }
}



/**
 * ConstructorMetadata
 *
 * Constructed through decorators.
 * It doesn't matter the order in which decorators are evaluated and called
 * the final/mapped/compiled metadata can be accessed through getParameterMetadataByName
 */
class ConstructorMetadata {

  target: Newable;

  _names: string[];
  _types: Newable[] = [];
  _elementTypes: { [s: number]: (Newable | DeferredNewable) } = {};

  constructor(target: Newable) {
    this.target = target;
    this._names = getParameterNames(target);
  }

  // if one does not exist, then one is created and the metadata is defined
  static getMetadata(target: Newable): ConstructorMetadata {

    let constructorMetadata = Reflect.getOwnMetadata(CONSTRUCTOR_METADATA, target);

    if (Helper.isUndefined(constructorMetadata)) {
      constructorMetadata = new ConstructorMetadata(target);
      Reflect.defineMetadata(CONSTRUCTOR_METADATA, constructorMetadata, target);
    }

    return constructorMetadata;
  }

  setTypes(types: Newable[]): void {
    this._types = [].concat(types);
  }

  setElementType(index: number, elementType: Newable | DeferredNewable): void {
    this._elementTypes[index] = elementType;
  }

  getNames(): string[] {
    return [].concat(this._names);
  }

  getParameterMetadataByIndex(index: number): ParameterMetadata {

    if (!this._names[index]) {
      return;
    }

    // TODO in STRICT MODE, throw error
    // if (Helper.isUndefined(this._types)) {
    //   throw new Error(
    //     `@Serializable() is missing from ${this.target.name || 'Anonymous'}.  ` +
    //     `Constructor metadata cannot be determined.`);
    // }

    let elementType = this._elementTypes[index];

    // infer an anonymous function as being a wrapper function and not a type
    if (elementType && elementType.name === '') {
      elementType = (elementType as DeferredNewable)();
    }

    return new ParameterMetadata(index, this._names[index], this._types[index], elementType as Newable);
  }

  getAllParameterMetadata(): ParameterMetadata[] {
    return this._names.map((name, index) => this.getParameterMetadataByIndex(index));
  }
}



/**
 * ParameterMetadata
 */
class ParameterMetadata {

  constructor(private _index: number,
              private _name: string,
              private _type: Newable,
              private _elementType: Newable) {

    this._elementType = _elementType || _type;
  }

  get name(): string { return this._name };

  get elementType(): Newable { return this._elementType };
}



/**
 * Parses JSON or an object literal to a typed instance
 *
 * @param json
 * @param {Newable<T>} type
 * @returns {T}
 */
function parse<T>(json: any, type: Newable<T>): T {

  // check first
  if (Helper.isUndefinedOrNull(json)) {
    return null;
  }

  // do not recurse further
  if (Helper.isUndefinedOrNull(type)) {
    // TODO strict mode - should we fail? not knowing the type should be okay
    return json;
  }

  // do before array-check
  if (Helper.isMapOrSet(type)) {
    return new type(json);
  }

  if (Array.isArray(json)) {
    // force to a false type assertion
    return json.map(o => parse(o, type)) as any as T;
  }

  if (PRIMITIVE_TYPES.get(typeof json) === type) {
    return json;
  }

  const constructorMetadata = ConstructorMetadata.getMetadata(type);

  if (PRIMITIVE_TYPES.has(typeof json)) {

    // TODO strict mode - primitive conversion
    if (PRIMITIVE_CONVERSIONS.has(type)) {
      return PRIMITIVE_CONVERSIONS.get(type)(json);
    }

    if (constructorMetadata.getNames().length < 2) {

      // useful for constructing objects that take a primitive
      // as a parameter such as Dates, Moments, ...
      // TODO fail in STRICT MODE - we are constructing where types MIGHT mismatch
      return new type(json);
    } else {

      // Can't infer because the JSON is a primitive and type has more than 1 argument
      // TODO STRICT MODE - we have a Type but it could not be serialized
      return json;
    }
  }

  const constructorArgs =
    constructorMetadata.getAllParameterMetadata()
      .map((parameterMetadata: ParameterMetadata) => {
        return parse(json[parameterMetadata.name], parameterMetadata.elementType);
      });

  const extraProperties = Helper.excludeKeys(json, constructorMetadata.getNames());
  const instance = new type(...constructorArgs);
  Object.assign(instance, extraProperties);

  return instance;
}

export const TSON = {

  /**
   * @param {string} json a json-formatted string (will be intially parsed using JSON.parse)
   * @param {{new(...x: any[]) => T}} type the root type to be returned, nested types will be determined through decorators.  if decorators are not present then generic objects will be returned in place of a actual class instance
   * @returns {T} the class instance or array of class instances
   */
  parse: <T>(json: string, type: { new(...x: any[]): T }): T => {
    return parse(JSON.parse(json), type);
  }
};


/**
 * ElementType Decorator
 *
 * ElementType exposes an Array's inner type.
 *
 * See: https://github.com/Microsoft/TypeScript/issues/7169
 *
 * @param {{new(...x: any[]) => any} | (() => {new(...x: any[]) => any})} type - a type (or a function that returns a type) that can be called using `new`
 * @returns {(target: Newable, propertyKey: string, parameterIndex: number) => any}
 * @constructor
 */
export function ElementType(type: { new(...x: any[]): any } | (() => { new(...x: any[]): any })) {
  return (target: Newable, propertyKey: string, parameterIndex: number) => {
    ConstructorMetadata.getMetadata(target).setElementType(parameterIndex, type);
  };
}



/**
 * Serializable Decorator
 *
 * @returns {(target: {new(...x: any[]) => any}) => any}
 * @constructor
 */
export function Serializable() {
  return (target: { new(...x: any[]): any }) => {

    const parameterTypes = Reflect.getOwnMetadata("design:paramtypes", target);
    const constructorMetadata = ConstructorMetadata.getMetadata(target);

    constructorMetadata.setTypes(parameterTypes);

    if (Array.isArray(parameterTypes)) {

      parameterTypes.forEach((type: string, index: number) => {

        if (Helper.isUndefined(type)) {

          const parameterMetadata = constructorMetadata.getParameterMetadataByIndex(index);

          throw new Error(
            `Parameter type is undefined.  [class="${target.name}"] [parameter=${parameterMetadata.name}] [index=${index}] ` +
            `Dependency is defined after it is used (known bug with Reflection Metadata) ` +
            `See https://github.com/Microsoft/TypeScript/issues/4114`);
        }
      });
    }

    if (Helper.isUndefined(parameterTypes)) {
      // TODO explicit constructor is missing. assume no-args constructor
    }
  };
}

