import { Observable, ReplaySubject } from 'rxjs';

/**
 * Will subscribe to the observable and return an observable that will reply oll the emissions of the source observable.
 *
 * Should only be used with short living observables, i.e. the ones that complete after a short time, and don't
 * require or expect unsubscribing.
 */
export function subscribeReplay<T>(
  shortLivingObservable$: Observable<T>
): Observable<T> {
  const result$ = new ReplaySubject<T>();
  shortLivingObservable$.subscribe(result$);
  return result$;
}
