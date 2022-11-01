import { ObservableInput } from 'rxjs';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export interface RequestOptions<T = unknown> extends RequestInit {
  parser?: (response: Response) => ObservableInput<T>;
}

export enum ResponseKeys {
  Headers = 'headers',
  Ok = 'ok',
  Redirected = 'redirected',
  Status = 'status',
  StatusText = 'statusText',
  Type = 'type',
  Url = 'url',
}

export type HttpErrorValues = Pick<Writeable<Response>, ResponseKeys>;

export interface HttpErrorResponse extends Error, HttpErrorValues {
  name: 'FES.HttpErrorResponse';
}
