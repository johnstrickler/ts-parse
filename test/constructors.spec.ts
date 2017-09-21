import { expect } from 'chai';
import { TSON } from '../src/Tson';
import { Serializable } from '../src/Decorators';

describe('Constructors', () => {

  @Serializable()
  class Foo {
    constructor(public bar: string, public baz: number) {

    }
  }

  it('should pass null for "bar", a missing constructor parameter', () => {
    let foo: Foo = TSON.parse('{"baz":123}', Foo);
    expect(foo.bar).eq(null);
  });

  it('should pass null for "baz", a missing constructor parameter', () => {
    let foo: Foo = TSON.parse('{"bar":"bye"}', Foo);
    expect(foo.baz).eq(null);
  });

});
