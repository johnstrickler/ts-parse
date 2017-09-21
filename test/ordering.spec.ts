import { expect } from 'chai';
import { ElementType, Serializable } from '../src/Decorators';
import { TSON } from '../src/Tson';

describe.skip('Definition Ordering', () => {

  // TODO this issue has to be fixed before going live
  // TODO allow use ElementType as a work around which accepts a FUNCTION
  //  () => ActualType

  // demonstrate out of order issue and if there is a solution or workaround
  // https://github.com/Microsoft/TypeScript/issues/4114

  class Bar {
    constructor(public baz: string) {

    }
  }

  @Serializable()
  class Foo {

    /**
     * the type metadata Bar would normally be undefined
     * since Bar is defined after Foo
     * but we can use ElementType to override this
     */
    constructor(public bar: Bar) {

    }
  }

  it('should lazily define a type that is defined after its usage', () => {
    const foo = TSON.parse('{"bar":{}}', Foo);
    expect(foo instanceof Foo).eq(true);
    expect(foo.bar instanceof Bar).eq(true);
  });


});
