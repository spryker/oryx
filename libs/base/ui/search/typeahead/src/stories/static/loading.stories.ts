import { sideBySide } from '@/tools/storybook';
import '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Loading`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`<oryx-typeahead ?isLoading=${true}>
    <input value="value" aria-label="label" />
  </oryx-typeahead>`);
};

export const Loading = Template.bind({});
