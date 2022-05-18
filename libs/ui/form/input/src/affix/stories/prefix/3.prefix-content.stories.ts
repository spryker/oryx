import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';
import '../../index';

export default {
  title: `${storybookPrefix}/Form/Form-control/prefix`,
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
PrefixContent.args = {
  prefixFill: true,
  disabled: false,
} as Props;
