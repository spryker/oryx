import { inject } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import { FeatureFlags, FeatureFlagsService } from './feature-flags.service';

export class DefaultFeatureFlagsService implements FeatureFlagsService {
  protected flags!: Flags;

  constructor(protected flagsArr = inject(FeatureFlags, null)) {
    this.flags =
      flagsArr?.reduce((acc, flags) => ({ ...acc, ...flags }), {}) ?? {};
  }

  getComponentFlags(
    name: string,
    flags?: Flags
  ): Observable<Flags[keyof Flags]> {
    return of((flags ?? this.flags)[name.toLowerCase()] ?? {});
  }

  getFlags(): Flags {
    return this.flags;
  }
}
