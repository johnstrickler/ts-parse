import { expect } from 'chai';
import { TSON } from '../src/Tson';
import { Serializable } from '../src/Decorators';

describe('Basics', () => {

  @Serializable()
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

  it('should instantiate Foo because it is decorated with @Serializable', () => {
    expect(foo instanceof Foo).eq(true);
  });

  it('should not instantiate Bar because it is not decorated with @Serializable', () => {
    expect(bar instanceof Bar).eq(false);
  });

});
