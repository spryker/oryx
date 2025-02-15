import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Form Control/Suffix`,
  args: {
    suffixFill: false,
    disabled: false,
  },
} as Meta;

interface Props {
  suffixFill: boolean;
  disabled: boolean;
}

const Template: Story<Props> = ({
  suffixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input ?suffixFill=${suffixFill}>
      <input placeholder="placeholder text" ?disabled=${disabled} />
      <span slot="suffix">suffix</span>
    </oryx-input>
  `;
};
export const SuffixFill = Template.bind({});
