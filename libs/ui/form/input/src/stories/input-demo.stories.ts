import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import '../index';

export default {
  title: `${storybookPrefix}/Form/Input`,
} as Meta;

interface Props {
  label: string;
  disabled: boolean;
  type: string;
  floatLabel: boolean;
}

const Template: Story<Props> = ({
  disabled,
  type,
  floatLabel,
  label,
}: Props): TemplateResult => {
  return html`
    <oryx-input ?floatLabel=${floatLabel} label=${label}>
      <input placeholder="Placeholder..." ?disabled=${disabled} type=${type} />
    </oryx-input>
  `;
};
export const InputDemo = Template.bind({});
InputDemo.args = {
  label: 'Label',
  disabled: false,
  floatLabel: false,
  type: 'text',
};

InputDemo.argTypes = {
  type: {
    options: ['text', 'number'],
    control: { type: 'select' },
  },
};
