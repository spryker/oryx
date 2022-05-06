import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../../.storybook/constant';
import '../../../index';

export default {
  title: `${storybookPrefix}/form/form-control/suffix`,
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
SuffixFill.args = {
  suffixFill: false,
  disabled: false,
} as Props;
