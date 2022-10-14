# Generics

There are 2 types of generics which should be named differently.

## Single non-semantic generics

A single generic that is used in a container without a special semantic meaning.
For example: `Promise<T>`, `Array<T>`, etc.

For this cases a simple `T` naming of generic is sufficient.

## Generics with semantic meaning

One or more generics that have a semantic meaning inside of their type.
For example: `Transformer<Output, Input>`.

In this case each generic MUST be given a name in UpperCamelCase format
which represents it's semantic meaning withing it's type.

For example:

```ts
interface Service<Subscription> {
  getData();
  subscribe(): Subscription;
}

type Transformer<Output, Input> = (
  data: Input,
  transformer: TransformerService
) => Output | Observable<Output>;
```
