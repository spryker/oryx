import { sideBySide } from '@/tools/storybook';
import '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Layout`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html` <oryx-typeahead up style="margin-top: 400px;">
    <input value="3" aria-label="label" />
    ${'123456789'.split('').map((i) => html`<oryx-option>${i}</oryx-option>`)}
  </oryx-typeahead>`);
};

export const DropUp = Template.bind({});
