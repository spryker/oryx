import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Form Control/Suffix`,
  args: {
    suffixIcon: 'search',
    suffixFill: false,
    disabled: false,
  },
} as Meta;
interface Props {
  disabled: boolean;
  suffixIcon: string;
  suffixFill: boolean;
}

const Template: Story<Props> = ({
  suffixIcon,
  suffixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input ?suffixFill=${suffixFill} suffixIcon=${suffixIcon}>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
    </oryx-input>
  `;
};
export const SuffixIcon = Template.bind({});
