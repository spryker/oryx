import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Checkbox`,
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

interface Props {
  intermediate: boolean;
  checked: boolean;
  disabled: boolean;
  hasError: boolean;
  label: string;
  subtext: string;
  errorMessage: string;
}

const Template: Story<Props> = ({
  intermediate,
  checked,
  disabled,
  label,
  subtext,
  hasError,
  errorMessage,
}): TemplateResult => {
  return html`
    <oryx-checkbox
      ?intermediate=${intermediate}
      ?hasError=${hasError}
      errorMessage=${errorMessage}
      @click=${console.log}
    >
      <input type="checkbox" ?checked=${checked} ?disabled=${disabled} />
      ${label}
      <small slot="subtext">${subtext}</small>
    </oryx-checkbox>
  `;
};

export const CheckboxDemo = Template.bind({});

CheckboxDemo.args = {
  label: 'Option',
  subtext: 'Subtext',
  errorMessage: '',
  hasError: false,
  intermediate: false,
  checked: false,
  disabled: false,
};
