Parse JSON as typed instances.  

## Installation

`npm install ts-parse`

## Prereqs

- TypeScript (for Decorator support)
- Enable `emitDecoratorMetadata` and `experimentalDecorators` in `tsconfig.json`:

  ```json
  {
    "compilerOptions": {
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true
    }
  }
  ```

## Approach

Typed parsing utilizes constructor-based injection to create actual class instances from JSON or plain JavaScript objects.  The [Reflect Metadata](https://github.com/rbuckton/reflect-metadata) shim, which is currently a ECMAScript proposal, exposes the type information of a constructor's parameters making it possible to instantiate objects from their real constructors. 

For example:

```ts
@Constructable()
class Address {

  constructor(private city: string, private state: string, private zip: string) {
    
  }
  
  getCityStateZip(): string {
    return `${this.city}, ${this.state} ${this.zip}`;
  }
}

let address = TSON.parse('{"city":"Richmond","state":"VA","zip":"23230"}', Address);

address instanceof Address; // true
address.getCityStateZip(); // "Richmond, VA 23230"
```

## Features

- Serialize JSON or POJOs to actual class instances
- Instantiation through construction injection
- Fully supports inheritance through super constructors
- Missing arguments in the constructor will be passed as NULL
- Extra JSON properties are set to the class instance via Object.assign

## Array Support

Array support is built-in, but, it requires a cast for compile-time type support.  This is necessary to 
support a simplified API and it eliminates the needs for an extra parsing method for Nth-degree Arrays (e.g. parseArray, parseArrayOfArrays, etc.).

```ts
@Constructable()
class Foo { }

const json = "[{},{}]";

// extra cast is required and can't be inferred
let foos = <Foo[]> TSON.parse(json, Foo);
foos[0] instanceof Foo; // true
```

```ts
@Constructable()
class Bar { }

const json = "[[{},{}]]";

// there's no limit to the amount of arrays that can be nested
let bars = <Bar[][]> TSON.parse(json, Bar);
bars[0][0] instanceof Bar; // true
```

## Alternative Approach

Another approach is to creating instances would be member injection which this project does not support. 

Tradeoffs and difficulties to field assignment:
 - Annotate every member (the "code bloat" is a net zero tradeoff to the constructor "bloat")
 - No support for inheritance - why? because we can't clearly define what properties to exclude getOwnProperties
 - Assign to -> fields and setters
 - How to handle -> readonly, private, protected, const


## Contributing

- Fork and/or clone repo.  
- Then `npm install`.  
- Run a quick test `npm run test`.  
- Make changes and run linter `npm run lint`.  
- Submit a Pull Request!

For local testing, you may need to install globals:

- `npm install mocha chai ts-node typings -g`
- `typings install dt~mocha --global --save`
- `typings install npm~chai --save`

