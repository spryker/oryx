import { inject } from '@spryker-oryx/di';
import {
  FeatureOptions,
  FeatureOptionsService,
} from './feature-options.service';

export class DefaultFeatureOptionsService implements FeatureOptionsService {
  protected options?: FeatureOptions;

  constructor(protected optionsArr = inject(FeatureOptions, null)) {
    this.options =
      optionsArr?.reduce((acc, options) => ({ ...acc, ...options }), {}) ?? {};
  }

  getFeatureOptions(name: string): FeatureOptions {
    return this.options?.[name.toLowerCase()] ?? {};
  }
}
