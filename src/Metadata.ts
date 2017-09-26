import { DeferredNewable, Newable } from './Tson';
import { Helper } from './Helper';
import * as getParameterNames from 'get-parameter-names';

export const CONSTRUCTOR_METADATA = Symbol('Constructors');

/**
 * ConstructorMetadata
 *
 * Constructed through decorators.
 * It doesn't matter the order in which decorators are evaluated and called
 * the final/mapped/compiled metadata can be accessed through getParameterMetadataByName
 */
export class ConstructorMetadata {

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

  setTypes(types: Newable[]) {
    this._types = [].concat(types);
  }

  setElementType(index: number, elementType: Newable | DeferredNewable) {
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
export class ParameterMetadata {

  constructor(private _index: number,
              private _name: string,
              private _type: Newable,
              private _elementType: Newable) {

    this._elementType = _elementType || _type;
  }

  get name(): string { return this._name };

  get elementType(): Newable { return this._elementType };
}
