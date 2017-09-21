import { ConstructorMetadata, ParameterMetadata } from './Metadata';
import { Helper } from './Helper';
import "reflect-metadata";

export const CONSTRUCTOR_METADATA = Symbol('Constructors');
export type Newable = { new(...x): any };
export type TypedNewable<T> = { new(...x): T };

/**
 * Parses JSON or an object literal to a typed instance
 *
 * @param json
 * @param {Newable<T>} type
 * @returns {T}
 */
function parse<T>(json: any, type: TypedNewable<T>): T {

  if (Helper.isUndefinedOrNull(json)) {
    return null;
  }

  if (!ConstructorMetadata.hasMetadata(type)) {
    return json;
  }

  if (Array.isArray(json)) {
    // incorrect casting to force a false type assertion
    return json.map(o => parse(o, type)) as any as T;
  }

  const constructorMetadata = ConstructorMetadata.getMetadata(type);

  const constructorArgs =
    constructorMetadata.getAllParameterMetadata()
      .map((parameterMetadata: ParameterMetadata) => {
        return parse(json[parameterMetadata.name], parameterMetadata.elementType);
      });

  const ctorParamNames = constructorMetadata.getAllParameterMetadata().map(x => x.name);
  const extraProperties = Helper.filter(json, ctorParamNames);

  // TODO use member annotations for properties that exist outside of constructor
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
  parse: <T>(json: any, type: TypedNewable<T>): T => {

    if (typeof json === 'string') {
      json = JSON.parse(json);
    }

    return parse(json, type);
  }
};
