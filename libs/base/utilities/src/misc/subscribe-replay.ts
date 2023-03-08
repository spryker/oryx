import { Observable, ReplaySubject, Unsubscribable } from 'rxjs';

/**
 * Will subscribe to the observable and return an observable that will reply oll the emissions of the source observable.
 *
 * In general, it should be used with short living observables, i.e. the ones that complete after a short time, and don't
 * require or expect unsubscribing. But for completeness, it also allows to unsubscribe to the source observable, if needed.
 */
export function subscribeReplay<T>(
  shortLivingObservable$: Observable<T>
): Observable<T> & Unsubscribable {
  const result$ = new ReplaySubject<T>();
  const subscription = shortLivingObservable$.subscribe(result$);
  result$.unsubscribe = () => {
    subscription.unsubscribe();
  };
  return result$;
}
