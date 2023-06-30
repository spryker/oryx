import { IconTypes } from '@spryker-oryx/ui/icon';
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
      <oryx-icon slot="prefix" .type=${IconTypes.Search}></oryx-icon>
      <span slot="prefix">more...</span>
    </oryx-input>
  `;
};
export const PrefixContent = Template.bind({});
