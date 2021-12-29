import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../model';

export default {
  title: 'TextControl/error',
} as Meta;

const Template: Story<Props> = ({
  showError,
  value,
  placeholder,
  label,
  disabled,
  readonly,
  error,
}: Props): TemplateResult => {
  return html`
<oryx-text-control label=${label} ?showError=${showError} .error=${error}>
    <input placeholder=${placeholder} value=${value} ?disabled=${disabled} ?readonly=${readonly}></input>
</oryx-text-control>
`;
};
export const WithoutMessage = Template.bind({});
WithoutMessage.args = {
  showError: true,
  disabled: false,
  readonly: false,
  placeholder: 'Fill in some data...',
  label: 'label',
  value: '',
  error: '',
};
