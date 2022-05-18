import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';
import '../../../index';

export default {
  title: `${storybookPrefix}/Form/Form-control/prefix`,
} as Meta;
interface Props {
  disabled: boolean;
  prefixFill: boolean;
  prefixIcon: string;
}

const Template: Story<Props> = ({
  prefixIcon,
  prefixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input prefixIcon=${prefixIcon} ?prefixFill=${prefixFill}>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
    </oryx-input>
  `;
};
export const PrefixIcon = Template.bind({});
PrefixIcon.args = {
  prefixIcon: 'search',
  prefixFill: false,
  disabled: false,
} as Props;
