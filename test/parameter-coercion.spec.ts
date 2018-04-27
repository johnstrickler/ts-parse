import { expect } from 'chai';
import { TSON, Constructable } from '../index';

describe('Parameter Coercion', () => {

  @Constructable()
  class Foo {
    constructor(public abc: number) { }
  }

  class NoFoo {
    constructor(public abc: number) { }
  }

  @Constructable()
  class Bar {
    constructor(public def: string) { }
  }

  class NoBar {
    constructor(public def: string) { }
  }

  @Constructable()
  class Baz {
    constructor(public ghi: boolean) {}
  }

  class NoBaz {
    constructor(public ghi: boolean) {}
  }

  it('should, when decorated, coerce a typed parameter from a string to a number', () => {
    let foo = TSON.parse('{"abc":"123"}', Foo);
    expect(foo.abc).eq(123);
  });

  it('should, when decorated, coerce a typed parameter from a boolean to a number', () => {
    let foo = TSON.parse('{"abc":true}', Foo);
    expect(foo.abc).eq(1);
  });

  it('should, when decorated, coerce a typed parameter from a number to a string', () => {
    let bar = TSON.parse('{"def":123}', Bar);
    expect(bar.def).eq('123');
  });

  it('should, when decorated, coerce a typed parameter from a boolean to a string', () => {
    let bar = TSON.parse('{"def":false}', Bar);
    expect(bar.def).eq('false');
  });

  it('should, when decorated, coerce a typed parameter from a string to a boolean', () => {
    let baz = TSON.parse('{"ghi":""}', Baz);
    expect(baz.ghi).eq(false);
  });

  it('should, when decorated, coerce a typed parameter from a number to a boolean', () => {
    let baz = TSON.parse('{"ghi":123}', Baz);
    expect(baz.ghi).eq(true);
  });

  it('should, when NOT decorated, provide a string to a number parameter', () => {
    let foo = TSON.parse('{"abc":"123"}', NoFoo);
    expect(foo.abc).eq('123');
  });

  it('should, when NOT decorated, provide a boolean to a number parameter', () => {
    let foo = TSON.parse('{"abc":true}', NoFoo);
    expect(foo.abc).eq(true);
  });

  it('should, when NOT decorated, provide a number to a string parameter', () => {
    let bar = TSON.parse('{"def":123}', NoBar);
    expect(bar.def).eq(123);
  });

  it('should, when NOT decorated, provide a boolean to a string parameter', () => {
    let bar = TSON.parse('{"def":false}', NoBar);
    expect(bar.def).eq(false);
  });

  it('should, when NOT decorated, provide a string to a boolean parameter', () => {
    let baz = TSON.parse('{"ghi":""}', NoBaz);
    expect(baz.ghi).eq("");
  });

  it('should, when NOT decorated, provide a number to a boolean parameter', () => {
    let baz = TSON.parse('{"ghi":123}', NoBaz);
    expect(baz.ghi).eq(123);
  });

});
