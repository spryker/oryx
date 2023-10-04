import { AppInitializer, PageMetaService } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { stopEventsForHydrationInsertion } from '@spryker-oryx/utilities';

export const StopEventsInitializer = `${AppInitializer}StopEvents`;

export class DefaultStopEventsInitializer implements AppInitializer {
  constructor(protected metaService = inject(PageMetaService, null)) {}

  initialize(): void {
    this.metaService?.add([
      {
        name: 'script',
        toBody: true,
        attrs: {
          text: stopEventsForHydrationInsertion,
        },
      },
    ]);
  }
}
