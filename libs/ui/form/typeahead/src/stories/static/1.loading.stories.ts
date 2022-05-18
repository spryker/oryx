import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../../../../popover/index';
import { sideBySide } from '../../../../../utilities/storybook';
import '../../index';

export default {
  title: `${storybookPrefix}/Form/Search/Typeahead/Static/Loading`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`<oryx-typeahead ?isLoading=${true}>
    <input value="value" aria-label="label" />
  </oryx-typeahead>`);
};

export const Loading = Template.bind({});
