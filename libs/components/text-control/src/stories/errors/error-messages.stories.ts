import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../model';

export default {
  title: 'TextControl/error',
} as Meta;

const Template: Story<Props> = ({
  value,
  error,
  disabled,
  readonly,
  placeholder,
  label,
  showError,
}: Props): TemplateResult => {
  return html`
<oryx-text-control label=${label} .error=${error}  ?showError=${showError}>
    <input placeholder=${placeholder} .value=${value} ?disabled=${disabled} ?readonly=${readonly}></input>
</oryx-text-control>
  `;
};
export const ErrorMessages = Template.bind({});
ErrorMessages.args = {
  value: '',
  placeholder: 'Fill in some data...',
  disabled: false,
  readonly: false,
  error: 'Error validation text',
  label: 'label',
  showError: false,
};
