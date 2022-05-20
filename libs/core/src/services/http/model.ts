import { ObservableInput } from 'rxjs';

export interface RequestOptions<T> extends RequestInit {
  parser?: (response: Response) => ObservableInput<T>;
}

export interface HttpErrorResponse extends Error {
  name: 'FES.HttpErrorResponse';
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
}
