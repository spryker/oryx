import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.storybook/constant';
import '../index';

export default {
  title: `${storybookPrefix}/form/input`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult =>
  html`
    <oryx-input label="label">
      <input placeholder="Give me a number" type="number" />
    </oryx-input>
  `;
export const Number = Template.bind({});
