import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Form/Form Control/Suffix`,
  args: {
    suffixFill: true,
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
      <input placeholder="Placeholder..." ?disabled=${disabled} />
      <oryx-icon slot="suffix" .type=${IconTypes.Search}></oryx-icon>
      <span slot="suffix">more...</span>
    </oryx-input>
  `;
};
export const SuffixContent = Template.bind({});
