import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../index';

export default {
  title: 'form/input',
} as Meta;

const Template: Story<unknown> = (): TemplateResult =>
  html`
    <oryx-input label="Label" style="width: 200px;">
      <input
        placeholder="Placeholder"
        value="this text is too long and won't be completely visible"
      />
    </oryx-input>
  `;
export const TextWithOverflow = Template.bind({});
