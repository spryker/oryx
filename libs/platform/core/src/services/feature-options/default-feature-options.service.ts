import { inject } from '@spryker-oryx/di';
import { map, Observable, ReplaySubject, scan, shareReplay } from 'rxjs';
import {
  FeatureOptions,
  FeatureOptionsService,
} from './feature-options.service';

export class DefaultFeatureOptionsService implements FeatureOptionsService {
  protected featureOptions$ = new ReplaySubject<FeatureOptions>(1);
  protected options$ = this.featureOptions$.pipe(
    scan((allOptions, newOptions) => {
      for (const [key, value] of Object.entries(newOptions)) {
        allOptions[key] ??= {};
        allOptions[key] = {
          ...(value ?? {}),
          ...allOptions[key],
        };
      }

      return allOptions;
    }, {} as FeatureOptions),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(protected optionsArr = inject(FeatureOptions, null)) {
    this.featureOptions$.next(
      optionsArr?.reduce((acc, options) => ({ ...acc, ...options }), {}) ?? {}
    );
  }

  getFeatureOptions(name: string): Observable<FeatureOptions> {
    return this.options$.pipe(
      map((options) => options[name.toLowerCase()] ?? {})
    );
  }

  getOptions(): Observable<FeatureOptions> {
    return this.options$;
  }

  addDefaultOptions(options: FeatureOptions): void {
    this.featureOptions$.next(options);
  }
}
