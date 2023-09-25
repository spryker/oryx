import { inject, INJECTOR } from '@spryker-oryx/di';
import { isPromise } from '@spryker-oryx/utilities';
import { isObservable, lastValueFrom, Observable } from 'rxjs';
import { AppInitializer, AppInitializerService } from './app-initializer';

export class DefaultAppInitializerService implements AppInitializerService {
  constructor(protected injector = inject(INJECTOR)) {}

  async initialize(): Promise<void> {
    const initializers = this.injector.inject(AppInitializer, []);

    for (const initializer of initializers) {
      let result: void | Observable<void> | Promise<void>;

      if (typeof initializer === 'function') {
        result = initializer();
      } else {
        result = initializer.initialize();
      }

      if (isPromise(result)) {
        await result;
      }

      if (isObservable(result)) {
        await lastValueFrom(result);
      }
    }
  }
}
