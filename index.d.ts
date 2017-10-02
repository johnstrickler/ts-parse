/// <reference path="node_modules/reflect-metadata/reflect-metadata.d.ts" />
import "reflect-metadata";
export declare const TSON: {
    parse: <T>(json: string, type: new (...x: any[]) => T) => T;
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
export declare function ElementType(type: {
    new (...x: any[]): any;
} | (() => {
    new (...x: any[]): any;
})): (target: new (...x: any[]) => any, propertyKey: string, parameterIndex: number) => void;
/**
 * Serializable Decorator
 *
 * @returns {(target: {new(...x: any[]) => any}) => any}
 * @constructor
 */
export declare function Serializable(): (target: new (...x: any[]) => any) => void;
