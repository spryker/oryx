import { AppRef } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  ExperienceDataRevealer,
  MessageType,
  postMessage,
} from '@spryker-oryx/experience';
import { Observable, from, tap } from 'rxjs';
import { ContentConfig } from '../adapter';

export class ContentConfigExperienceDataRevealer
  implements ExperienceDataRevealer
{
  protected appRef = inject(AppRef);
  protected contentConfig = inject(ContentConfig);

  protected contentConfig$ = from(this.appRef.whenReady()).pipe(
    tap(() =>
      postMessage({
        type: MessageType.ContentConfig,
        data: this.contentConfig.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        ),
      })
    )
  );

  reveal(): Observable<unknown> {
    return this.contentConfig$;
  }
}
