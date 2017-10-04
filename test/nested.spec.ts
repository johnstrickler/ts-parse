import { expect } from 'chai';
import { Constructable, TSON } from '../index';

describe('Nested Objects', () => {

  @Constructable()
  class Toy {
    constructor() {

    }
  }

  @Constructable()
  class Child {
    constructor(public favoriteToy: Toy) {

    }
  }

  @Constructable()
  class Parent {
    constructor(public child: Child) {
    }
  }


  const json = '{"child":{"favoriteToy":{}}}';
  let parent: Parent;

  beforeEach(() => {
    parent = TSON.parse(json, Parent);
  });

  it('should instantiate a Parent object', () => {
    expect(parent instanceof Parent).eq(true);
  });

  it('should instantiate a nested Child object', () => {
    expect(parent.child instanceof Child).eq(true);
  });

  it('should instantiate a deeper nested Toy object', () => {
    expect(parent.child.favoriteToy instanceof Toy).eq(true);
  });

});
