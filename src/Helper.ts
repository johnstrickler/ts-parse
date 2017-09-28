/**
 * Utility functions
 */
export class Helper {

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
