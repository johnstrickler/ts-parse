import { expect } from 'chai';
import { TSON } from '../src/Tson';

describe('Root Objects', () => {

  class NotDecorated {

  }

  it("can generically serialize a typed object", () => {
    const obj: NotDecorated = TSON.parse("{}", NotDecorated);
    expect(JSON.stringify(obj)).eq("{}");
    expect(obj instanceof NotDecorated).eq(false);
  });

});
