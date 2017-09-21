import { Newable } from './Tson';
import { Helper } from './Helper';
import { ConstructorMetadata } from './Metadata';

/**
 * ElementType Decorator
 *
 * ElementType exposes an Array's inner type.
 *
 * See: https://github.com/Microsoft/TypeScript/issues/7169
 *
 * @param {Newable} type
 * @returns {(target: Newable, propertyKey: string, parameterIndex: number) => any}
 * @constructor
 */
export function ElementType(type: Newable) {
  return (target: Newable, propertyKey: string, parameterIndex: number) => {
    ConstructorMetadata.getMetadata(target).setElementType(parameterIndex, type);
  };
}

/**
 * Serializable Decorator
 *
 * @returns {(target: Newable) => any}
 * @constructor
 */
export function Serializable() {
  return (target: Newable) => {

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
      // TODO constructor is missing.  if extraProperties is configured off then this will be an empty object.
      // How can feedback be given?  can a report be created by TSC?
    }
  };
}
