import { inject, INJECTOR } from '@spryker-oryx/di';
import { isPromise } from '@spryker-oryx/utilities';
import { isObservable, lastValueFrom } from 'rxjs';
import { AppInitializer, AppInitializerService } from './app-initializer';

export class DefaultAppInitializerService implements AppInitializerService {
  constructor(protected injector = inject(INJECTOR)) {}

  async initialize(): Promise<void> {
    const initializers = this.injector.inject(AppInitializer, []);

    for (const initializer of initializers) {
      const result =
        typeof initializer === 'function'
          ? initializer()
          : initializer.initialize();

      if (isPromise(result)) await result;

      if (isObservable(result)) await lastValueFrom(result);
    }
  }
}
