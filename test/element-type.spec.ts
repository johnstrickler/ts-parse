import { expect } from 'chai';
import { TSON } from '../src/Tson';
import { ElementType, Serializable } from '../src/Decorators';

describe('Element Type', () => {

  class Bar {

  }

  class Foo {
    constructor(@ElementType(Bar) public bar: Bar) {

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

  it('infer constructor parameter from Element Type even without Serializable', () => {
    expect(foo.bar instanceof Bar).eq(true);
  });

});


