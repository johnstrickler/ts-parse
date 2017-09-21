import { expect } from 'chai';
import { TSON } from '../src/Tson';
import { Model } from '../src/Decorators';

describe('Extra Properties', () => {

  @Model()
  class Baz {

  }

  @Model()
  class Foo {

    public extraArg: Baz;

    constructor(public bar: string, public baz: Baz) {

    }
  }

  const json = '{"bar": "via constructor", "baz": {}, "extraArg": {"assigned": "via Object.assign"}, "extraArg2": 123}';
  let foo: Foo;

  beforeEach(() => {
    foo = TSON.parse(json, Foo);
  });

  it('should contain "bar", a property set via Constructor', () => {
    expect(foo.bar).eq("via constructor");
  });

  it('should contain "extraArg", a property set via Object.assign', () => {
    expect(!!foo.extraArg).eq(true);
  });

  it('should contain "extraArg" which also has a property called "assigned"', () => {
    expect(!!(foo.extraArg as any).assigned).eq(true);
  });

  it('should "extraArg" be a generic object due to assignment outside of the constructor', () => {
    expect(foo.extraArg instanceof Baz).eq(false);
  });

  it('should contain "extraArg2", a property set via Object.assign', () => {
    expect((foo as any).extraArg2).eq(123);
  });

  it('should "baz" be an instance of Baz', () => {
    expect(foo.baz instanceof Baz).eq(true);
  });

});


