import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../index';

export default {
  title: 'form/form-control',
} as Meta;

interface Props {
  disabled: boolean;
  readonly: boolean;
}

const Template: Story<Props> = ({
  readonly,
  disabled,
}: Props): TemplateResult =>
  html`
    <oryx-input label="Label">
      <oryx-icon slot="prefix" type="search"></oryx-icon>
      <input
        placeholder="Placeholder.."
        ?readonly=${readonly}
        ?disabled=${disabled}
      />
    </oryx-input>
  `;
export const Readonly = Template.bind({});
Readonly.args = {
  readonly: true,
  disabled: false,
};
