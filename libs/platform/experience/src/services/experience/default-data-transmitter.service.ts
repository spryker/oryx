import {
  AppRef,
  FeatureOptionsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { merge, Observable, of, tap } from 'rxjs';
import { DataTransmitterService } from './data-transmitter.service';
import { sendPostMessage } from './utilities';

export const REQUEST_GRAPHICS_MESSAGE_TYPE = 'oryx.resources-preview-request';
export const REQUEST_OPTIONS_MESSAGE_TYPE = 'oryx.options-preview-request';

export const enum DataIds {
  Graphics = 'oryx-graphics',
  Options = 'oryx-options',
}

export class DefaultDataTransmitterService implements DataTransmitterService {
  constructor(
    protected appRef = inject(AppRef),
    protected optionsService = inject(FeatureOptionsService)
  ) {}

  protected optionsInitializer$ = this.optionsService.getOptions().pipe(
    tap((option) =>
      sendPostMessage({
        type: REQUEST_OPTIONS_MESSAGE_TYPE,
        [DataIds.Options]: option,
      })
    )
  );
  protected graphicsInitializer$ = of(
    this.appRef.findPlugin(ResourcePlugin)?.getResources()
  ).pipe(
    tap((resources) => {
      sendPostMessage({
        type: REQUEST_GRAPHICS_MESSAGE_TYPE,
        [DataIds.Graphics]: Object.keys(resources?.graphics ?? {}),
      });
    })
  );
  protected initializer$ = merge(
    this.optionsInitializer$,
    this.graphicsInitializer$
  );

  initialize(): Observable<unknown> {
    return this.initializer$;
  }
}
