Parse JSON as Typed Instances in TypeScript

John Strickler
strickjb@gmail.com

2017-09-21

## Installation

`npm install ts-parse`

## Prereqs

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
@Serializable
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

## Features and Gotchas

- Serialize JSON or POJOs to actual class instances
- Instantiation through construction injection
- Fully supports inheritance through super constructors
- Missing arguments in the constructor will be passed as NULL
- Extra JSON properties are set to the class instance via Object.assign

## Array Support

Array support is built in but requires a cast for compile-time type support.  This is required to 
support a simplified API without creating extra parsing methods to support types.

```ts
@Serializable
class Foo { }

const json = "[{},{}]";

// extra cast is required and can't be inferred
let foos = <Foo[]> TSON.parse(json, Foo);
foos[0] instanceof Foo; // true
```

```ts
@Serializable
class Bar { }

const json = "[[{},{}]]";

// there's no limit to the amount of arrays that can be nested
let bars = <Bar[][]> TSON.parse(json, Bar);
bars[0][0] instanceof Bar; // true
```

## Getters and Setters

```
// -------------------------------------------------------------------------------------------------
// TODO make easy getter/setter injection. 
// for example:
//
// class A {
//
//   constructor(private _foo: string} {
// 
//   }
//  
//   get foo() { return this._foo; };
//
// }
//
// then TSON.parse('{"foo":"something"}'
// will serialize into either "_foo" param or "foo" param.  if both are detected then ignore "_foo"?
// this should be an optional config item probably
// -------------------------------------------------------------------------------------------------
```

## Configuration

- TODO Generic serialization when type information does not exist (defaults to true)
- TODO Serialize Private Arguments via prefix (defaults to "_")
- TODO Serialize extra JSON properties to class instance (defaults to true)



## Alternative Approach

Another approach is to creating instances would be member injection which this project does not support. 

Tradeoffs and difficulties to field assignment:
 - Annotate every member (the "code bloat" is a net zero tradeoff to the constructor "bloat")
 - No support for inheritance - why? because we can't clearly define what properties to exclude getOwnProperties
 - Assign to -> fields and setters
 - How to handle -> readonly, private, protected, const


## Future Potential / Plugins
- TODO Angular4 Serialization Plugin
  - HttpClient.get<Foo>(...);  
  - The problem is the generic type is erased.  We'd have to pass the type - integrating into the existing API would be difficult or impossible.  Unless the HttpInterceptor could ... do something cool.


## Contributing

- Fork and/or clone repo.  
- Then `npm install`.  
- Run a quick test `npm run test`.  
- Make changes and run linter `npm run lint`.  
- Submit a Pull Request!

You may need to install globals:

- `npm install mocha chai ts-node typings -g`
- `typings install dt~mocha --global --save`
- `typings install npm~chai --save`

## Known Issues

Ordering - Dependencies must come before use or they'll be undefined.  
In webpack, this might not be avoidable.  
What's the workaround? 
See: https://github.com/Microsoft/TypeScript/issues/4114

One workaround would be to use getters for ElementTypes - that's a last resort.  Could probably use a UnionType 
