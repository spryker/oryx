import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Textarea`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;
interface Props {
  label: string;
  disabled: boolean;
  floatLabel: boolean;
  hasError: boolean;
  errorMessage: string;
}

const Template: Story<Props> = ({
  label,
  disabled,
  floatLabel,
  hasError,
  errorMessage,
}: Props): TemplateResult =>
  html`
    <oryx-input
      label=${label}
      ?floatLabel=${floatLabel}
      ?hasError=${hasError}
      errorMessage=${errorMessage}
    >
      <textarea placeholder="Placeholder" ?disabled=${disabled}></textarea>
    </oryx-input>
  `;
export const TextareaDemo = Template.bind({});
TextareaDemo.args = {
  label: 'Label',
  disabled: false,
  floatLabel: false,
  hasError: false,
  errorMessage: '',
};
