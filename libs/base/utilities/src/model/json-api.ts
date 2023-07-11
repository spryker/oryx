export interface HttpHeaders {
  [key: string]: string | undefined;
}

export interface Relationship {
  id: string;
  type: string;
}

export type Relationships = Record<string, Record<'data', Relationship[]>>;

export interface Data<A> {
  attributes: A;
  id?: string;
  relationships?: Relationships;
}

export interface Include<T, A> extends Data<A> {
  type: T;
  id: string;
}

export interface JsonApiModel<A, I, U = unknown> {
  data: U extends Array<unknown> ? Data<A>[] : Data<A>;
  included?: I;
}

export interface JsonApiPayload<T> {
  data: T;
}
