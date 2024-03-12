import { sideBySide } from '@/tools/storybook';
import '@spryker-oryx/ui/popover';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Typeahead/Static/Layout`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return sideBySide(html`
    <oryx-typeahead style="--oryx-popover-maxheight:200px;">
      <input value="second" aria-label="label" />
      <oryx-option>first</oryx-option>
      <oryx-option>second</oryx-option>
      <oryx-option>3rd</oryx-option>
      <oryx-option>4</oryx-option>
      <oryx-option>5</oryx-option>
      <oryx-option>6</oryx-option>
    </oryx-typeahead>
  `);
};

export const MaxHeight = Template.bind({});
