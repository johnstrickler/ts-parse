
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

  static filter(json: object, excludedKeys: string[]) {
    return Object.keys(json)
      .filter(key => !excludedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = json[key];
        return obj;
      }, {});
  }
}
