import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../constant';
import '../../../../popover/index';
import { sideBySide } from '../../../../utilities/storybook';
import '../../index';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Layout`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html` <oryx-typeahead style="margin-top: 400px;">
    <input value="3" aria-label="label" />
    ${'123456789'.split('').map((i) => html`<oryx-option>${i}</oryx-option>`)}
  </oryx-typeahead>`);
};

export const DropUp = Template.bind({});
