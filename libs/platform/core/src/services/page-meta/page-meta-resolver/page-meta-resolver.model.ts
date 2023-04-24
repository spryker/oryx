export interface ElementResolver {
  title?: string;
  [key: string]: string | undefined;
}

export const enum ResolverScore {
  NotUsed = 0,
  Fallback = -1,
}
