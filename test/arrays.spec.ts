import { expect } from 'chai';
import { ElementType, Serializable, TSON } from '../index';

describe('Arrays', () => {

  @Serializable()
  class Foo {

  }

  const json = '[{}]';
  let foos: Foo[];

  beforeEach(() => {
    foos = <Foo[]> TSON.parse(json, Foo);
  });

  it('should instantiate an array as root', () => {
    expect(Array.isArray(foos)).eq(true);
  });

  it('should have a length of 1', () => {
    expect(foos.length).eq(1);
  });

  it('should contain as instance of Foo', () => {
    expect(foos[0] instanceof Foo).eq(true);
  });

});

describe('Typed Array Properties', () => {

  @Serializable()
  class Bar {

  }

  @Serializable()
  class Foo {
    constructor(@ElementType(Bar) public bars: Bar[]) {

    }
  }


  @Serializable()
  class Foo2 {
    constructor(public bars: Bar[]) {

    }
  }

  const json = '{"bars":[{},{}]}';
  let foo: Foo;

  beforeEach(() => {
    foo = TSON.parse(json, Foo);
  });

  it('should serialize typed objects in arrays when decorated with ElementType', () => {
    expect(Array.isArray(foo.bars)).eq(true);
    expect(foo.bars.length).eq(2);
    expect(foo.bars[0] instanceof Bar).eq(true);
  });

  it('should not serialize typed objects in arrays when not decorated with ElementType', () => {
    const foo2 = TSON.parse(json, Foo2);
    expect(Array.isArray(foo2.bars)).eq(true);
    expect(foo2.bars.length).eq(2);
    expect(foo2.bars[0] instanceof Bar).eq(false);
  });

});


describe('Multi-dimensional Arrays', () => {

  @Serializable()
  class Bar {

  }

  const json = '[[{},{}]]';
  let bars: Bar[][];

  beforeEach(() => {
    bars = <Bar[][]> TSON.parse(json, Bar);
  });

  it('should instantiate an array as root', () => {
    expect(Array.isArray(bars)).eq(true);
  });

  it('should first-level array have a length of 1', () => {
    expect(bars.length).eq(1);
  });

  it('should second-level array have a length of 2', () => {
    expect(bars[0].length).eq(2);
  });

  it('should second-level array have two instances of Bar', () => {
    expect(bars[0][0] instanceof Bar).eq(true);
    expect(bars[0][1] instanceof Bar).eq(true);
  });
});
