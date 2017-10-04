import { expect } from 'chai';
import { Constructable, TSON } from '../index';

describe('Inheritance', () => {

  class Shape {
    constructor(public borderSize: number) {

    }
  }

  @Constructable()
  class Rectangle extends Shape {
    constructor(public x: number, public y: number, borderSize: number) {
      super(borderSize);
    }

    getArea(): number {
      return this.x * this.y;
    }
  }

  @Constructable()
  class Square extends Rectangle {
    constructor(x: number, borderSize: number) {
      super(x, x, borderSize);
    }
  }

  const json = '{"x":10,"borderSize":1}';
  let square: Square;

  beforeEach(() => {
    square = TSON.parse(json, Square);
  });

  it('should be an instance of a Square', () => {
    expect(square instanceof Square).eq(true);
  });

  it('should also be an instance of a Rectangle', () => {
    expect(square instanceof Rectangle).eq(true);
  });

  it('should also be an instance of a Shape', () => {
    expect(square instanceof Shape).eq(true);
  });

  it('should return area of 100', () => {
    expect(square.getArea()).eq(100);
  });
});
