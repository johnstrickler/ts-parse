import { expect } from 'chai';
import { ElementType, TSON } from '../index';

describe('Definition Order Workaround', () => {

  // workaround for out of order issue
  // https://github.com/Microsoft/TypeScript/issues/4114

  class Foo {
    constructor(@ElementType(() => Bar) public bar: Bar) {
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
