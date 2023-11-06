import { ReactiveController, ReactiveControllerHost } from 'lit';
import { BehaviorSubject, Observable, defer } from 'rxjs';

export class ObserveController<T extends ReactiveControllerHost>
  implements ReactiveController
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected observablesMap = new Map<keyof T, BehaviorSubject<any>>();

  constructor(protected host: T) {
    (this.host = host).addController(this);
  }

  get<K extends keyof T>(property: K): Observable<T[K]> {
    return defer(() => {
      if (!this.observablesMap.has(property)) {
        this.observablesMap.set(
          property,
          new BehaviorSubject(this.host[property])
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const subject$ = this.observablesMap.get(property)!;

      if (subject$.getValue() !== this.host[property]) {
        subject$.next(this.host[property]);
      }

      return subject$;
    });
  }

  hostUpdated(): void {
    for (const [property, subject$] of this.observablesMap.entries()) {
      if (this.host[property] !== subject$.getValue()) {
        subject$.next(this.host[property]);
      }
    }
  }
}
