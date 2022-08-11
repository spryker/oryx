import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Form Control/Prefix`,
  args: {
    prefixFill: true,
    disabled: false,
  },
} as Meta;
interface Props {
  prefixFill: boolean;
  disabled: boolean;
}

const Template: Story<Props> = ({
  prefixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input ?prefixFill=${prefixFill}>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
      <oryx-icon slot="prefix" type="search"></oryx-icon>
      <span slot="prefix">more...</span>
    </oryx-input>
  `;
};
export const PrefixContent = Template.bind({});
