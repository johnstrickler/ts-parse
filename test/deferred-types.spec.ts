import { expect } from 'chai';
import { ConstructAs, TSON } from '../index';

describe('Deferred Type Workaround', () => {

  // workaround for out of order issue
  // https://github.com/Microsoft/TypeScript/issues/4114

  class Foo {
    constructor(@ConstructAs(() => Bar) public bar: Bar) {
    }
  }

  class Bar {
    constructor() {
    }
  }

  it('should lazily define a type that is defined after its usage', () => {
    const foo = TSON.parse('{"bar":{}}', Foo);
    expect(foo.bar instanceof Bar).eq(true);
  });

});
