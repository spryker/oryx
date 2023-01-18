import { inject } from '@spryker-oryx/di';
import { Observable, of } from 'rxjs';
import {
  FeatureFlags,
  FeatureFlagsService,
  Flags,
} from './feature-flags.service';

export class DefaultFeatureFlagsService implements FeatureFlagsService {
  protected flags!: Flags;

  constructor(protected flagsArr = inject(FeatureFlags)) {
    this.flags = flagsArr.reduce((acc, flags) => ({ ...acc, ...flags }), {});
  }

  getComponentFlags(
    name: string,
    flags?: Flags
  ): Observable<Flags[keyof Flags]> {
    return of({
      ...(flags ?? this.flags).global,
      ...(flags ?? this.flags)[name.toLowerCase()],
    });
  }

  getFlags(): Flags {
    return this.flags;
  }
}
