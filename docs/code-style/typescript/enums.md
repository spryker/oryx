## Enums

Enums name and keys should be written in UpperCamelCase.

### Public API Enums

- const enums.
- library should have preserveConstEnums in ts config (in our case it's enabled)

```ts
export const enum EnumType {
  KeyKey = 'value',
}
```
