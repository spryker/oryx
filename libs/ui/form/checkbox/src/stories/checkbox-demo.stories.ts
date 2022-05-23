import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import '../index';

export default {
  title: `${storybookPrefix}/Form/Checkbox`,
} as Meta;

interface Props {
  intermediate: boolean;
  checked: boolean;
  disabled: boolean;
  error: boolean;
  label?: string;
}

const Template: Story<Props> = ({
  intermediate,
  checked,
  disabled,
  label,
  error,
}): TemplateResult => {
  return html`
    <oryx-checkbox
      ?intermediate=${intermediate}
      ?error=${error}
      @click=${console.log}
    >
      <input type="checkbox" ?checked=${checked} ?disabled=${disabled} />
      ${label}
    </oryx-checkbox>
  `;
};

export const CheckboxDemo = Template.bind({});

CheckboxDemo.args = {
  intermediate: false,
  checked: false,
  disabled: false,
  error: false,
  label: 'Option',
};
