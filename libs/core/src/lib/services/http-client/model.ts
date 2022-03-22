import { ObservableInput } from 'rxjs';

export interface HttpClientOptions<T> extends RequestInit {
  parser?: (response: Response) => ObservableInput<T>;
}
