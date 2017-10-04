import "reflect-metadata";
/**       ^       **\
 - LIBRARY EXPORTS -
\**     _____     **/
export declare const TSON: {
    parse: <T>(json: string, type: new (...x: any[]) => T) => T;
};
/**
 * ConstructAs Decorator
 *
 * ConstructAs exposes an Array's inner type.
 *
 * See: https://github.com/Microsoft/TypeScript/issues/7169
 *
 * @param {{new(...x: any[]) => any} | (() => {new(...x: any[]) => any})} type - a type (or a function that returns a type) that can be called using `new`
 * @returns {(target: Newable, propertyKey: string, parameterIndex: number) => any}
 */
export declare function ConstructAs(type: {
    new (...x: any[]): any;
} | (() => {
    new (...x: any[]): any;
})): (target: new (...x: any[]) => any, propertyKey: string, parameterIndex: number) => void;
/**
 * Constructable Decorator
 *
 * @returns {(target: {new(...x: any[]) => any}) => any}
 */
export declare function Constructable(): (target: new (...x: any[]) => any) => void;
