import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.storybook/constant';
import '../index';

export default {
  title: `${storybookPrefix}/Form/Form control/Static/Label`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult =>
  html`
    <oryx-input label="Label">
      <input placeholder="With label" />
    </oryx-input>

    <oryx-input>
      <input placeholder="Without label" />
    </oryx-input>

    <style>
      oryx-input {
        width: 200px;
        margin-bottom: 24px;
      }
    </style>
  `;
export const Label = Template.bind({});
