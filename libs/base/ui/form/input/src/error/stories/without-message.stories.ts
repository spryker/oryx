import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { Props } from './model';

export default {
  title: `${storybookPrefix}/Form/Form Control/Error`,
  args: {
    disabled: false,
    readonly: false,
    placeholder: 'Fill in some data...',
    label: 'Without error message',
    value: '',
  },
} as Meta;

const Template: Story<Props> = ({
  value,
  placeholder,
  label,
  disabled,
  readonly,
}: Props): TemplateResult => {
  return html`
    <oryx-input label=${label} hasError>
      <input
        placeholder=${placeholder}
        value=${value}
        ?disabled=${disabled}
        ?readonly=${readonly}
      />
    </oryx-input>
  `;
};
export const WithoutMessage = Template.bind({});
