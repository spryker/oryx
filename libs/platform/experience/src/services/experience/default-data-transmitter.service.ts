import {
  AppRef,
  FeatureFlagsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { DataTransmitterService } from './data-transmitter.service';
import { sendPostMessage } from './utilities';

export const REQUEST_RESOURCES_MESSAGE_TYPE = 'oryx.resources-preview-request';
export const REQUEST_FLAGS_MESSAGE_TYPE = 'oryx.flags-preview-request';

export const enum DataIds {
  Graphics = 'graphics',
  Flags = 'feature-flags',
}

export class DefaultDataTransmitterService implements DataTransmitterService {
  constructor(
    protected appRef = inject(AppRef),
    protected flagsService = inject(FeatureFlagsService)
  ) {}

  initialize(): void {
    this.initializeGraphics();
    this.initializeFeatureFlags();
  }

  protected initializeGraphics(): void {
    const resources = this.appRef.findPlugin(ResourcePlugin)?.getResources();

    sendPostMessage({
      type: REQUEST_RESOURCES_MESSAGE_TYPE,
      [DataIds.Graphics]: Object.keys(resources?.graphics ?? {}),
    });
  }

  protected initializeFeatureFlags(): void {
    sendPostMessage({
      type: REQUEST_FLAGS_MESSAGE_TYPE,
      [DataIds.Flags]: this.flagsService.getFlags(),
    });
  }
}
