import { expect } from 'chai';
import { Constructable, TSON } from '../index';

describe('Constructors', () => {

  @Constructable()
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
