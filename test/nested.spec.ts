import { expect } from 'chai';
import { TSON } from '../src/Tson';
import { Serializable } from '../src/Decorators';

describe('Nested Objects', () => {

  @Serializable()
  class Toy {
    constructor() {

    }
  }

  @Serializable()
  class Child {
    constructor(public favoriteToy: Toy) {

    }
  }

  @Serializable()
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
