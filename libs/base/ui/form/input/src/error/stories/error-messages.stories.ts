import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { Props } from './model';

export default {
  title: `${storybookPrefix}/Form/Form Control/Error`,
  args: {
    value: '',
    placeholder: 'Fill in some data...',
    disabled: false,
    readonly: false,
    errorMessage: 'Error validation text',
    label: 'error messages',
  },
} as Meta;

const Template: Story<Props> = ({
  value,
  errorMessage,
  disabled,
  readonly,
  placeholder,
  label,
}: Props): TemplateResult => {
  return html`
    <oryx-input label=${label} errorMessage=${errorMessage}>
      <input
        placeholder=${placeholder}
        value=${value}
        ?disabled=${disabled}
        ?readonly=${readonly}
      />
    </oryx-input>
  `;
};
export const ErrorMessages = Template.bind({});
