import {
  combineLatest,
  defer,
  EMPTY,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { OryxMetadata, OryxPackage } from '../models';

export class PackagesService {
  protected readonly packages$;
  protected readonly metadata$;

  constructor(
    readonly packages: string[] = JSON.parse(
      import.meta.env.ORYX_PACKAGES ?? '[]'
    )
  ) {
    this.packages$ = defer(() => of(packages.map((name) => ({ name })))).pipe(
      shareReplay(1)
    );

    this.metadata$ = this.packages$.pipe(
      switchMap((packages) =>
        combineLatest(
          packages.map((pkg) =>
            import(`${pkg.name}/package.json`).then(
              (m) => m.default as Record<string, unknown>
            )
          )
        )
      ),
      switchMap((packages) =>
        combineLatest(
          packages
            .filter((pkg) => pkg['oryx'])
            .map((pkg) =>
              import(`${pkg.name}${pkg['oryx']}`).then(
                (m) =>
                  ({
                    name: pkg.name,
                    ...m.default,
                  } as OryxMetadata)
              )
            )
        )
      ),
      shareReplay(1)
    );
  }

  getPackages(): Observable<OryxPackage[]> {
    return this.packages$;
  }

  getInstalledPackages(): Observable<OryxPackage[]> {
    return EMPTY;
  }

  getPackagesMetadata(): Observable<OryxMetadata[]> {
    return this.metadata$;
  }
}
