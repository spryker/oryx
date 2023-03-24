import { inject, INJECTOR } from '@spryker-oryx/di';
import { isObservable, Subscription } from 'rxjs';
import { AppInitializer, AppInitializerService } from './app-initializer';

export class DefaultAppInitializerService implements AppInitializerService {
  protected subscription = new Subscription();

  constructor(protected injector = inject(INJECTOR)) {}

  initialize(): void {
    const initializers = this.injector.inject(AppInitializer, []);

    for (const initializer of initializers) {
      const result = initializer.initialize();

      if (isObservable(result)) {
        this.subscription.add(result.subscribe());
      }
    }
  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }
}
