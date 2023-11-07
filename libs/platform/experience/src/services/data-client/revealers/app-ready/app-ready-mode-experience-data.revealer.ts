import { AppRef } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { from, Observable, tap } from 'rxjs';
import { MessageType } from '../../data-client.model';
import { ExperienceDataRevealer } from '../../data-client.service';
import { postMessage } from '../../utilities';

export class AppReadyExperienceDataRevealer implements ExperienceDataRevealer {
  constructor(protected appRef = inject(AppRef)) {}

  protected appReady$ = from(this.appRef.whenReady()).pipe(
    tap(() => postMessage({ type: MessageType.AppReady, data: null }))
  );

  reveal(): Observable<unknown> {
    return this.appReady$;
  }
}
