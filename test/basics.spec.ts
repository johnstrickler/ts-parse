import { expect } from 'chai';
import { TSON } from '../src/Tson';
import { Model } from '../src/Decorators';

describe('Basics', () => {

  @Model()
  class Foo {

  }

  class Bar {

  }

  const json = '{}';
  let foo: Foo;
  let bar: Bar;

  beforeEach(() => {
    foo = TSON.parse(json, Foo);
    bar = TSON.parse(json, Bar);
  });

  it('should instantiate Foo because it is decorated with @Model', () => {
    expect(foo instanceof Foo).eq(true);
  });

  it('should not instantiate Bar because it is not decorated with @Model', () => {
    expect(bar instanceof Bar).eq(false);
  });

});
