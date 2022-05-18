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
      <span slot="prefix">prefix</span>
    </oryx-input>
  `;
};
export const PrefixFill = Template.bind({});
PrefixFill.args = {
  prefixFill: true,
  disabled: false,
} as Props;
