import {
  AppRef,
  FeatureOptionsService,
  ResourcePlugin,
} from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { DataTransmitterService } from './data-transmitter.service';
import { sendPostMessage } from './utilities';

export const REQUEST_RESOURCES_MESSAGE_TYPE = 'oryx.resources-preview-request';
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

  initialize(): void {
    this.initializeGraphics();
    this.initializeOptions();
  }

  protected initializeGraphics(): void {
    const resources = this.appRef.findPlugin(ResourcePlugin)?.getResources();

    sendPostMessage({
      type: REQUEST_RESOURCES_MESSAGE_TYPE,
      [DataIds.Graphics]: Object.keys(resources?.graphics ?? {}),
    });
  }

  protected initializeOptions(): void {
    sendPostMessage({
      type: REQUEST_OPTIONS_MESSAGE_TYPE,
      [DataIds.Options]: this.optionsService.getOptions(),
    });
  }
}
