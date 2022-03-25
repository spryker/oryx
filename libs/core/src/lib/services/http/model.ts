import { ObservableInput } from 'rxjs';

export interface RequestOptions<T> extends RequestInit {
  parser?: (response: Response) => ObservableInput<T>;
}
