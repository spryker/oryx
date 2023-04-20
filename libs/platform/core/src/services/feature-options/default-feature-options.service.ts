import { inject } from '@spryker-oryx/di';
import {
  FeatureOptions,
  FeatureOptionsService,
} from './feature-options.service';

export class DefaultFeatureOptionsService implements FeatureOptionsService {
  protected options?: Record<string, object | undefined>;

  constructor(protected optionsArr = inject(FeatureOptions, null)) {
    this.options =
      optionsArr?.reduce((acc, options) => ({ ...acc, ...options }), {}) ?? {};
  }

  getFeatureOptions<N extends keyof FeatureOptions>(name: N): FeatureOptions[N];
  getFeatureOptions(name: string): object;
  getFeatureOptions(name: string): object {
    return this.options?.[name.toLowerCase()] ?? {};
  }
}
