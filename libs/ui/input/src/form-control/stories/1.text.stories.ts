import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../index';

export default {
  title: 'form/input',
} as Meta;

const Template: Story<unknown> = (): TemplateResult =>
  html`
    <oryx-input label="Label">
      <input placeholder="Placeholder" />
    </oryx-input>
  `;
export const Text = Template.bind({});
