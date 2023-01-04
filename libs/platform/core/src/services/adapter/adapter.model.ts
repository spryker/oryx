import { Observable } from 'rxjs';

export interface Adapter<T, Q> {
  normalize?(item: any): T;
  serialize?(item: T): string;
  getKey(qualifier: Q): string;
  get(qualifier: Q): Observable<T>;
}
