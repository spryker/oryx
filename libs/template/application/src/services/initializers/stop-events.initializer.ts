import { AppInitializer, PageMetaService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { captureEventsForHydrationInsertion } from '@spryker-oryx/utilities';

export const StopEventsInitializer = `${AppInitializer}StopEvents`;

export class DefaultCaptureEventsInitializer implements AppInitializer {
  constructor(protected metaService = inject(PageMetaService, null)) {}

  initialize(): void {
    this.metaService?.add([
      {
        name: 'script',
        toBody: true,
        attrs: {
          text: captureEventsForHydrationInsertion,
        },
      },
    ]);
  }
}
