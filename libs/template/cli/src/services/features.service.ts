import { inject } from '@spryker-oryx/di';
import { EMPTY, map, Observable, shareReplay } from 'rxjs';
import { OryxFeature } from '../models';
import { PackagesService } from './packages.service';

export class FeaturesService {
  protected readonly features$;
  protected readonly presets$;

  constructor(protected readonly packagesService = inject(PackagesService)) {
    this.features$ = this.packagesService.getPackagesMetadata().pipe(
      map((metadata) =>
        metadata
          .map(
            (meta) =>
              meta.features?.map((feature) => ({
                ...feature,
                package: meta.name,
              })) ?? []
          )
          .flat()
      ),
      shareReplay(1)
    );

    this.presets$ = this.features$.pipe(
      map((features) => features.filter((feature) => feature.isPreset)),
      shareReplay(1)
    );
  }

  getFeatures(): Observable<OryxFeature[]> {
    return this.features$;
  }

  getPresets(): Observable<OryxFeature[]> {
    return this.presets$;
  }

  getInstalledFeatures(): Observable<OryxFeature[]> {
    return EMPTY;
  }
}
