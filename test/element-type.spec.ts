import { expect } from 'chai';
import { ConstructAs, TSON } from '../index';

describe('Element Type', () => {

  class Bar {

  }

  class Foo {
    constructor(@ConstructAs(Bar) public bar: Bar) {

    }
  }

  const json = '{"bar":{}}';
  let foo: Foo;

  beforeEach(() => {
    foo = TSON.parse(json, Foo);
  });

  it('infer root class from the type parameter in parse', () => {
    expect(foo instanceof Foo).eq(true);
  });

  it('infer constructor parameter from Element Type even without Constructable', () => {
    expect(foo.bar instanceof Bar).eq(true);
  });

});


