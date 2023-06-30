import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Form Control/Prefix`,
  args: {
    label: 'Label',
    floatLabel: false,
    prefixFill: true,
    disabled: false,
  },
  parameters: { 
    chromatic: { 
       disableSnapshot: true 
    }
 },
} as Meta;

interface Props {
  label: string;
  floatLabel: boolean;
  prefixFill: boolean;
  disabled: boolean;
}

const Template: Story<Props> = ({
  floatLabel,
  label,
  prefixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input
      label=${label}
      ?floatLabel=${floatLabel}
      ?prefixFill=${prefixFill}
    >
      <input placeholder="Placeholder..." ?disabled=${disabled} />
      <span slot="prefix">prefix</span>
    </oryx-input>
  `;
};
export const PrefixFill = Template.bind({});
