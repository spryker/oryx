import { AppRef, ResourcePlugin, Resources } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { MediaExperienceService } from './media-experience-service';
import { sendPostMessage } from './utilities';

export const REQUEST_RESOURCES_MESSAGE_TYPE = 'oryx.resources-preview-request';
export const enum MediaIds {
  Graphics = 'graphics',
}

export class DefaultMediaExperienceService implements MediaExperienceService {
  protected resources?: Resources;

  constructor(protected appRef = inject(AppRef)) {
    this.resources = this.appRef.findPlugin(ResourcePlugin)?.getResources();
  }

  initialize(): void {
    this.initializeGraphics();
  }

  protected initializeGraphics(): void {
    sendPostMessage({
      type: REQUEST_RESOURCES_MESSAGE_TYPE,
      [MediaIds.Graphics]: Object.keys(this.resources?.graphics ?? {}),
    });
  }
}
