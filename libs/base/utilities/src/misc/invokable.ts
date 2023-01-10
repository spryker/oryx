import { Observable, ReplaySubject } from 'rxjs';

export function invokable<T>(observable$: Observable<T>): Observable<T> {
  const result$ = new ReplaySubject<T>();

  observable$.subscribe(result$);

  return result$;
}
