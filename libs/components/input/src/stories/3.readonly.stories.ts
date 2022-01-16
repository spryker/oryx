import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../index';
import { Props } from './model';

export default {
  title: 'form/input',
} as Meta;

const Template: Story<Props> = ({
  readonly,
  disabled,
}: Props): TemplateResult =>
  html`
<oryx-input label="Label">
  <oryx-icon slot="prefix" type="search"></oryx-icon>
  <input placeholder="Placeholder.." ?readonly=${readonly} ?disabled=${disabled}></input>
</oryx-input>
`;
export const Readonly = Template.bind({});
Readonly.args = {
  readonly: true,
  disabled: false,
};
