import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Input`,
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

interface Props {
  label: string;
  disabled: boolean;
  type: string;
  floatLabel: boolean;
  hasError: boolean;
  errorMessage: string;
}

const Template: Story<Props> = ({
  disabled,
  type,
  floatLabel,
  label,
  hasError,
  errorMessage,
}: Props): TemplateResult => {
  return html`
    <oryx-input
      label=${label}
      ?floatLabel=${floatLabel}
      ?hasError=${hasError}
      errorMessage=${errorMessage}
    >
      <input placeholder="Placeholder..." ?disabled=${disabled} type=${type} />
    </oryx-input>
  `;
};
export const InputDemo = Template.bind({});
InputDemo.args = {
  label: 'Label',
  disabled: false,
  floatLabel: false,
  hasError: false,
  errorMessage: '',
  type: 'text',
};

InputDemo.argTypes = {
  type: {
    options: ['text', 'number'],
    control: { type: 'select' },
  },
};
