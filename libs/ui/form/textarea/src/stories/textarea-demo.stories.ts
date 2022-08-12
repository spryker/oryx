import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Textarea`,
} as Meta;
interface Props {
  label: string;
  disabled: boolean;
  floatLabel: boolean;
}

const Template: Story<Props> = ({
  disabled,
  floatLabel,
  label,
}: Props): TemplateResult =>
  html`
    <oryx-input ?floatLabel=${floatLabel} label=${label}>
      <textarea placeholder="Placeholder" ?disabled=${disabled}></textarea>
    </oryx-input>
  `;
export const TextareaDemo = Template.bind({});
TextareaDemo.args = {
  label: 'Label',
  disabled: false,
  floatLabel: false,
};
