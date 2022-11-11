# Multi Providers

Most of the dependencies in app correspond to only one value, such as for example a class. But there are some occasions where we want to have dependencies with multiple different values. (common example is http interceptors or normalizers). But it wouldn't be very practical to configure all these dependencies separately, because we want to access them all together at once. So the solution is to have a special type of dependency that accepts multiple values, not just one, linked to the exact same dependency injection token.

## Providing

Providers which token naming is ended with asterisk (`*`) `[token-base-name]*`:

- creates multi providers with array of elements.

```ts
[
  {
    provider: 'multi*',
    useValue: 'a',
  },
  {
    provider: 'multi*',
    useValue: 'b',
  },
  {
    provider: 'multi*',
    useValue: 'c',
  },
];
///
inject('multi*'); // [a,b,c];
```

Providers which token naming is included with asterisk (`*`) `[token-base-name]*[token-specifier-name]`:

- creates single provider by token `[token-base-name]*[token-specifier-name]`.
- creates multi providers with array of elements by token `[token-base-name]*`.

```ts
[
  {
    provider: 'multi*a',
    useValue: 'a',
  },
  {
    provider: 'multi*b',
    useValue: 'b',
  },
  {
    provider: 'multi*c',
    useValue: 'c',
  },
];
///
inject('multi*a'); // a;
inject('multi*b'); // b;
inject('multi*c'); // c;
inject('multi*'); // [a,b,c];
```

Providers which token naming is included with asterisk (`*`) twice (or more) `[token-base-name]*[sub-token-name]*[token-specifier-name]`:

- creates single provider by token `[token-base-name]*[sub-token-name]*[token-specifier-name]`.
- creates multi providers with array of elements by token `[token-base-name]*`.
- creates multi providers with array of elements by token `[token-base-name]*[sub-token-name]*`.

```ts
[
  {
    provider: 'multi*a',
    useValue: 'a',
  },
  {
    provider: 'multi*b',
    useValue: 'b',
  },
  {
    provider: 'multi*new*c',
    useValue: 'c',
  },
  {
    provider: 'multi*new*d',
    useValue: 'd',
  },
];
///
inject('multi*a'); // a;
inject('multi*b'); // b;
inject('multi*new*c'); // c;
inject('multi*new*d'); // d;
inject('multi*'); // [a,b,c,d];
inject('multi*new*'); // [c,d];
```

It is possible to merge multiple providers in case if provider was created by `[token-base-name]*[token-specifier-name]` token and another one added by `[token-base-name]*` token.

```ts
[
  {
    provider: 'multi*a',
    useValue: 'a',
  },
  {
    provider: 'multi*',
    useValue: 'b',
  },
];
///
inject('multi*a'); // a;
inject('multi*'); // [a,b];
```
