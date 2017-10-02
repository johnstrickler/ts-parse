import { expect } from 'chai';
import { TSON } from '../index';

describe('Inference', () => {

  class Zero {
    public arguments;
    constructor() {
      // capture passed argument to test
      this.arguments = arguments;
    }
  }

  class One {
    constructor(public arg: any) {

    }
  }

  class Many {
    constructor(public arg1: any, public arg2: any) {

    }
  }

  it('(string) should instantiate a typed class given a zero-argument constructor', () => {
    let zero = TSON.parse('"a"', Zero);
    expect(zero instanceof Zero).eq(true);
    expect(zero.arguments[0]).eq('a');
  });

  it('(string) should instantiate a typed class given a single-argument constructor', () => {
    let one = TSON.parse('"b"', One);
    expect(one instanceof One).eq(true);
    expect(one.arg).eq("b");
  });

  it('(string) should return a raw value given a multiple-argument constructor', () => {
    let many = TSON.parse('"c"', Many);
    expect(many instanceof Many).eq(false);
    expect(many).eq("c");
  });

  it('(number) should instantiate a typed class given a zero-argument constructor', () => {
    let zero = TSON.parse('1', Zero);
    expect(zero instanceof Zero).eq(true);
    expect(zero.arguments[0]).eq(1);
  });

  it('(number) should instantiate a typed class given a single-argument constructor', () => {
    let one = TSON.parse('2', One);
    expect(one instanceof One).eq(true);
    expect(one.arg).eq(2);
  });

  it('(number) should return a raw value given a multiple-argument constructor', () => {
    let many = TSON.parse('3', Many);
    expect(many instanceof Many).eq(false);
    expect(many).eq(3);
  });

  it('(boolean) should instantiate a typed class given a zero-argument constructor', () => {
    let zero = TSON.parse('true', Zero);
    expect(zero instanceof Zero).eq(true);
    expect(zero.arguments[0]).eq(true);
  });

  it('(boolean) should instantiate a typed class given a single-argument constructor', () => {
    let one = TSON.parse('false', One);
    expect(one instanceof One).eq(true);
    expect(one.arg).eq(false);
  });

  it('(boolean) should return a raw value given a multiple-argument constructor', () => {
    let many = TSON.parse('true', Many);
    expect(many instanceof Many).eq(false);
    expect(many).eq(true);
  });

  it('(object) should instantiate a typed given a zero-argument constructor', () => {
    let zero = TSON.parse('{}', Zero);
    expect(zero instanceof Zero).eq(true);
  });

  it('(object) should instantiate a typed class given a single-argument constructor', () => {
    let one = TSON.parse('{"arg":"foo"}', One);
    expect(one instanceof One).eq(true);
    expect(one.arg).eq("foo");
  });

  it('(object) should instantiate a typed class given a multiple-argument constructor', () => {
    let many = TSON.parse('{"arg1":123,"arg2":true}', Many);
    expect(many instanceof Many).eq(true);
    expect(many.arg1).eq(123);
    expect(many.arg2).eq(true);
  });

  it('(object) should instantiate a typed class and assign extra properties', () => {
    let zero = TSON.parse('{"foo":123,"bar":true}', Zero);
    expect(zero instanceof Zero).eq(true);
    expect(zero['foo']).eq(123);
    expect(zero['bar']).eq(true);
  });

});
