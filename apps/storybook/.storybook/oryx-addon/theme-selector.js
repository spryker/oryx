import { ORYX_STORYBOOK_THEME, SET_STORYBOOK_THEME } from '../app/utils';
import { ToolSelector } from './tool-selector';

export class ThemeSelector extends ToolSelector {
  getToolIdentifier() {
    return ORYX_STORYBOOK_THEME;
  }
  getToolActionIdentifier() {
    return SET_STORYBOOK_THEME;
  }

  getSelectorTitle() {
    return 'Change the theme of the preview';
  }
}
