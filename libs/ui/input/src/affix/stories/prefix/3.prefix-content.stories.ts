import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../index';

export default {
  title: `${storybookPrefix}/form/form-control/prefix`,
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
