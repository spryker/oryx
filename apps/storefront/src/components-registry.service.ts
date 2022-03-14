import { inject } from '@spryker-oryx/injector';
import { from, mapTo, Observable, of, tap } from 'rxjs';
import { ComponentsRegistryContract } from './components-registry.contract';

export interface RegistryComponents {
  [wildcard: string]: boolean;
}

export class ComponentsRegistryService implements ComponentsRegistryContract {
  protected resolvedComponents: RegistryComponents = {};
  protected registeredComponents = inject('FES.ComponentMapping');

  resolveTag(type: string): string {
    return this.registeredComponents[type]?.name ?? type;
  }

  resolveComponent(type: string): Observable<string> {
    if (this.registeredComponents[type]) {
      if (
        this.registeredComponents[type].component &&
        !this.resolvedComponents[type]
      ) {
        return from(this.registeredComponents[type].component()).pipe(
          tap(() => {
            this.resolvedComponents[type] = true;
          }),
          mapTo(this.resolveTag(type))
        );
      }
      return of(this.resolveTag(type));
    } else {
      console.error(`Missing component implementation for type ${type}.`);
    }
  }
}
