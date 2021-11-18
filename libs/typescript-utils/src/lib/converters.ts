export type NullableGeneric<T> = T | null;
export type MakePropRequired<T, K extends keyof T> = Pick<
  T,
  Exclude<keyof T, K>
> & {
  [P in K]-?: Exclude<T[P], undefined>;
};
export type MakePropNotNullable<T, K extends keyof T> = Pick<
  T,
  Exclude<keyof T, K>
> & {
  [P in K]-?: Exclude<T[P], null>;
};
