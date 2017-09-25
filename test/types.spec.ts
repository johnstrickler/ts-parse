import { TSON } from '../src/Tson';
import { expect } from 'chai';

describe('Types', () => {

 // not working.

 // could pass the primitive without checking the number of constructor args
 // side effects would be bad.  need to enable strict mode from the start
 // and start a definitions files


  // Strict mode (default) - no inferrence

  // TODO Moment

  // TODO RegEx

  // TODO Map
  // new <K, V>(entries?: [K, V][]): Map<K, V>;
  // new <K, V>(iterable: Iterable<[K, V]>): Map<K, V>;

  // TODO WeakMap
  // new <K extends object, V>(entries?: [K, V][]): WeakMap<K, V>;
  //new <K extends object, V>(iterable: Iterable<[K, V]>): WeakMap<K, V>;

  // TODO Set
  // new <T>(values?: T[]): Set<T>;
  // new <T>(iterable: Iterable<T>): Set<T>;

  // TODO WeakSet
  // new <T extends object>(values?: T[]): WeakSet<T>;
  // new <T extends object>(iterable: Iterable<T>): WeakSet<T>;

  it('should serialize a Date instance from a string', () => {
    let date = TSON.parse('"2017-09-21T19:45:48.560Z"', Date);
    expect(date instanceof Date).eq(true);
  });

  it('should serialize a Date instance from a number', () => {
    let date = TSON.parse('1506023148560', Date);
    expect(date instanceof Date).eq(true);
  });

  it('should serialize a string primitive from a string', () => {
    let string = TSON.parse('"foobar"', String);
    expect(typeof string).eq('string');
    expect(string).eq('foobar');
  });

  it('should serialize a string primitive from a number', () => {
    let string = TSON.parse('12345', String);
    expect(typeof string).eq('string');
    expect(string).eq('12345');
  });

  it('should serialize a string primitive from a boolean', () => {
    let string = TSON.parse('true', String);
    expect(typeof string).eq('string');
    expect(string).eq('true');
  });

  it('should serialize a number primitive from a string', () => {
    let number = TSON.parse('"01234"', Number);
    expect(typeof number).eq('number');
    expect(number).eq(1234);
  });

  it('should serialize a number primitive from a number', () => {
    let number = TSON.parse('67890', Number);
    expect(typeof number).eq('number');
    expect(number).eq(67890);
  });

  it('should serialize a number primitive from a boolean', () => {
    let number = TSON.parse('true', Number);
    expect(typeof number).eq('number');
    expect(number).eq(1);
  });

  it('should serialize a boolean primitive from a string', () => {
    let bool = TSON.parse('"1234"', Boolean);
    expect(typeof bool).eq('boolean');
    expect(bool).eq(true);
  });

  it('should serialize a boolean primitive from a number', () => {
    let bool = TSON.parse('0', Boolean);
    expect(typeof bool).eq('boolean');
    expect(bool).eq(false);
  });

  it('should serialize a boolean primitive from a boolean', () => {
    let bool = TSON.parse('false', Boolean);
    expect(typeof bool).eq('boolean');
    expect(bool).eq(false);
  });



  // TODO Wrapper !== primitive.
  it('should serialize a Moment instance', () => {

  });

  it('should serialize a Map instance', () => {

  });

});
