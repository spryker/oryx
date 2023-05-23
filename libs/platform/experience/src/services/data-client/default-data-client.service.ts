import { inject } from '@spryker-oryx/di';
import { merge, Observable, shareReplay } from 'rxjs';
import {
  ExperienceDataClientService,
  ExperienceDataRevealer,
} from './data-client.service';

export class DefaultExperienceDataClientService
  implements ExperienceDataClientService
{
  constructor(protected revealers = inject(ExperienceDataRevealer, [])) {}

  protected initializer$ = merge(
    ...this.revealers.map((revealer) => revealer.reveal())
  ).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  initialize(): Observable<unknown> {
    return this.initializer$;
  }
}
