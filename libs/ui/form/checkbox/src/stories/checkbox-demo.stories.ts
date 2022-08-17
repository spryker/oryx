import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { checkboxComponent } from '../component';

useComponent(checkboxComponent);

export default {
  title: `${storybookPrefix}/Form/Checkbox`,
} as Meta;

interface Props {
  intermediate: boolean;
  checked: boolean;
  disabled: boolean;
  hasError: boolean;
  label?: string;
}

const Template: Story<Props> = ({
  intermediate,
  checked,
  disabled,
  label,
  hasError,
}): TemplateResult => {
  return html`
    <oryx-checkbox
      ?intermediate=${intermediate}
      ?hasError=${hasError}
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
  hasError: false,
  label: 'Option',
};
