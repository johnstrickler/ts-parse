import { CONSTRUCTOR_METADATA, Newable } from './Tson';
import { Helper } from './Helper';
import * as getParameterNames from 'get-parameter-names';

/**
 * ConstructorMetadata
 *
 * Constructed through decorators.
 * It doesn't matter the order in which decorators are evaluated and called
 * the final/mapped/compiled metadata can be accessed through getParameterMetadataByName
 */
export class ConstructorMetadata {

  target: Newable;

  // required metadata
  _names: string[];
  _types: Newable[] = [];
  _elementTypes: { [s: number]: Newable; } = {};

  constructor(target: Newable) {
    this.target = target;
    this.setNames(getParameterNames(target));
  }

  private setNames(names: string[]) {
    this._names = [].concat(names);
  }

  setTypes(types: Newable[]) {
    this._types = [].concat(types);
  }

  setElementType(index: number, elementType: Newable) {
    this._elementTypes[index] = elementType;
  }

  hasTypeInformation(): boolean {
    return this._types.length > 0 || Object.keys(this._elementTypes).length > 0;
  }

  getParameterMetadataByIndex(index: number): ParameterMetadata {

    if (!this._names[index]) {
      return;
    }

    // if (Helper.isUndefined(this._types)) {
    //   throw new Error(
    //     `@Serializable() is missing from ${this.target.name || 'Anonymous'}.  ` +
    //     `Constructor metadata cannot be determined.`);
    // }

    return new ParameterMetadata(index, this._names[index], this._types[index], this._elementTypes[index]);
  }

  getAllParameterMetadata(): ParameterMetadata[] {
    return this._names.map((name, index) => this.getParameterMetadataByIndex(index));
  }


  // check for the present of metadata without the risk of inadvertantly creating it
  static hasMetadata(target: Newable): boolean {
    return Reflect.hasOwnMetadata(CONSTRUCTOR_METADATA, target);
  }

  // gets the current metadata object for a constructor
  // if one does not exist, then one is created and the metadata is defined
  static getMetadata(target: Newable): ConstructorMetadata {

    let constructorMetadata = Reflect.getOwnMetadata(CONSTRUCTOR_METADATA, target);

    if (Helper.isUndefined(constructorMetadata)) {
      constructorMetadata = new ConstructorMetadata(target);
      Reflect.defineMetadata(CONSTRUCTOR_METADATA, constructorMetadata, target);
    }

    return constructorMetadata;
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
