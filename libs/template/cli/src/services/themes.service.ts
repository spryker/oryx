import { inject } from '@spryker-oryx/di';
import { EMPTY, map, Observable, shareReplay } from 'rxjs';
import { OryxTheme } from '../models';
import { PackagesService } from './packages.service';

export class ThemesService {
  protected readonly themes$;

  constructor(protected readonly packagesService = inject(PackagesService)) {
    this.themes$ = this.packagesService.getPackagesMetadata().pipe(
      map((metadata) =>
        metadata
          .map(
            (meta) =>
              meta.themes?.map((theme) => ({
                ...theme,
                package: meta.name,
              })) ?? []
          )
          .flat()
      ),
      shareReplay(1)
    );
  }

  getThemes(): Observable<OryxTheme[]> {
    return this.themes$;
  }

  getInstalledThemes(): Observable<OryxTheme[]> {
    return EMPTY;
  }
}
