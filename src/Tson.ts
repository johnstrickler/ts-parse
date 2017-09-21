import { ConstructorMetadata, ParameterMetadata } from './Metadata';
import { Helper } from './Helper';
import * as getParameterNames from 'get-parameter-names';
import "reflect-metadata"; // TODO needed?

export const CONSTRUCTOR_METADATA = Symbol('Constructors');

export type Newable<T = any> = { new(...x): T };

const BOXED_PRIMITIVES = {
  boolean: Boolean,
  number: Number,
  string: String
}


// TODO implement strict typing where every object has to be constructed
const configuration = {
  strict: false
};

function argsByName() {

}


/**
 * Parses JSON or an object literal to a typed instance
 *
 * @param json
 * @param {Newable<T>} type
 * @returns {T}
 */
function parse<T>(json: any, type: Newable<T>): T {

  if (Helper.isUndefinedOrNull(json)) {
    return null;
  }

  if (Helper.isUndefinedOrNull(type)) {
    return json;
  }

  if (Array.isArray(json)) {
    // force to a false type assertion
    return json.map(o => parse(o, type)) as any as T;
  }

  if (BOXED_PRIMITIVES[typeof json] === type) {
    return json;
  }

  const constructorMetadata = ConstructorMetadata.getMetadata(type);
  const parameterNames = constructorMetadata.getAllParameterMetadata().map(x => x.name);

  if (BOXED_PRIMITIVES[typeof json]) {

    if (parameterNames.length === 1) {

      // useful for constructing objects that take a primitive
      // as a parameter such as Dates, Moments, ...
      // TODO fail in STRICT MODE - we are constructing based on names where types MIGHT mismatch
      return new type(json);
    } else {

      // can't infer, return the (untyped) raw value
      // TODO STRICT MODE [primitive-type-mismatch] - the Type is different from the JSON raw value
      return json;
    }
  }

  const constructorArgs =
    constructorMetadata.getAllParameterMetadata()
      .map((parameterMetadata: ParameterMetadata) => {
        return parse(json[parameterMetadata.name], parameterMetadata.elementType);
      });

  const extraProperties = Helper.filter(json, parameterNames);
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
