import { inject } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import {
  FeatureOptions,
  FeatureOptionsService,
  OptionsMergeStrategies,
} from './feature-options.service';

export class DefaultFeatureOptionsService implements FeatureOptionsService {
  protected options!: FeatureOptions;

  constructor(protected optionsArr = inject(FeatureOptions, null)) {
    this.options =
      optionsArr?.reduce((acc, options) => ({ ...acc, ...options }), {}) ?? {};
  }

  getComponentOptions(
    name: string
  ): Observable<FeatureOptions[keyof FeatureOptions]> {
    return of(this.options[name.toLowerCase()] ?? {});
  }

  getOptions(): FeatureOptions {
    return this.options;
  }

  mergeOptions(
    options: FeatureOptions,
    strategy = OptionsMergeStrategies.Prepend
  ): void {
    for (const [key, value] of Object.entries(options)) {
      this.options[key] = {
        ...(strategy === OptionsMergeStrategies.Prepend && value),
        ...this.options[key],
        ...(strategy === OptionsMergeStrategies.Append && value),
      };
    }
  }
}
