export interface ElementResolver {
  title?: string;
  [key: string]: string | undefined;
}

export const enum ResolverScore {
  NotUsed = -1,
  Fallback = 0,
  Default = 1,
  OverrideDefault = 2,
}
