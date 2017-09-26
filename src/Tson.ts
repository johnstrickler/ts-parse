import { ConstructorMetadata, ParameterMetadata } from './Metadata';
import { Helper } from './Helper';
import "reflect-metadata";

export type Newable<T = any> = { new(...x): T };

export type DeferredNewable<T = any> = () => Newable<T>;

const PRIMITIVE_CONVERSIONS = new Map<Newable, Function>([
  [Boolean, (v) => !!v],
  [Number, (v) => +v],
  [String, (v) => Helper.isUndefinedOrNull(v) ? '' : v + '']
]);

const PRIMITIVE_TYPES = {
  boolean: Boolean,
  number: Number,
  string: String
};

// TODO implement strict typing where every object has to be constructed
// const configuration = {
//   strict: false
// };



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

  //
  if (Array.isArray(json)) {
    // force to a false type assertion
    return json.map(o => parse(o, type)) as any as T;
  }

  if (PRIMITIVE_TYPES[typeof json] === type) {
    return json;
  }

  const constructorMetadata = ConstructorMetadata.getMetadata(type);

  if (PRIMITIVE_TYPES[typeof json]) {

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

/**
 * API
 */
export const TSON = {

  /**
   * @param json json input can be a string (which will be parsed using JSON.parse, or an object, or an array)
   * @param {Newable<T>} type  the root type to be returned, nested types will be determined through decorators.  if decorators are not present then generic objects will be returned in place of a actual class instance
   * @returns {T} the class instance or array of class instances
   */
  parse: <T>(json: string, type: Newable<T>): T => {
    return parse(JSON.parse(json), type);
  }
};
