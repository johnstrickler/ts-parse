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

  static values(obj: {}) {
    return Object.keys(obj).map(key => obj[key]);
  }

  static excludeKeys(json: object, keys: string[]) {
    return Object.keys(json)
      .filter(key => !keys.includes(key))
      .reduce((obj, key) => {
        obj[key] = json[key];
        return obj;
      }, {});
  }
}
