import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Form Control/Prefix`,
  args: {
    label: 'Label',
    floatLabel: false,
    prefixIcon: 'search',
    prefixFill: false,
    disabled: false,
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;
interface Props {
  label: string;
  floatLabel: boolean;
  disabled: boolean;
  prefixFill: boolean;
  prefixIcon: string;
}

const Template: Story<Props> = ({
  floatLabel,
  label,
  prefixIcon,
  prefixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input
      label=${label}
      ?floatLabel=${floatLabel}
      prefixIcon=${prefixIcon}
      ?prefixFill=${prefixFill}
    >
      <input placeholder="Placeholder..." ?disabled=${disabled} />
    </oryx-input>
  `;
};
export const PrefixIcon = Template.bind({});
