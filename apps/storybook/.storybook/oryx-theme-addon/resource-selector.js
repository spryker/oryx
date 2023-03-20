import { ORYX_STORYBOOK_RESOURCE, SET_STORYBOOK_RESOURCE } from '../app/utils';
import { ToolSelector } from './tool-selector';

export class ResourceSelector extends ToolSelector {
  getToolActionIdentifier() {
    return SET_STORYBOOK_RESOURCE;
  }

  getToolIdentifier() {
    return ORYX_STORYBOOK_RESOURCE;
  }

  getSelectorTitle() {
    return 'Change the resource of the preview';
  }

  getToolIcon() {
    return 'document';
  }
}
