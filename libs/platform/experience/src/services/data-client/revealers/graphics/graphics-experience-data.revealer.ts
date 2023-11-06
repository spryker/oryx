import { AppRef } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { Observable, of, tap } from 'rxjs';
import { ResourcePlugin } from '../../../../plugins';
import { MessageType } from '../../data-client.model';
import { ExperienceDataRevealer } from '../../data-client.service';
import { postMessage } from '../../utilities';

export class GraphicsExperienceDataRevealer implements ExperienceDataRevealer {
  constructor(protected appRef = inject(AppRef)) {}

  protected graphics$ = of(
    this.appRef.requirePlugin(ResourcePlugin).getGraphics()
  ).pipe(
    tap((graphics) => {
      postMessage({
        type: MessageType.Graphics,
        data: Object.keys(graphics ?? {}),
      });
    })
  );

  reveal(): Observable<unknown> {
    return this.graphics$;
  }
}
