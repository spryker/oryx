import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';
import '../../../index';

export default {
  title: `${storybookPrefix}/form/form-control/suffix`,
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
    <oryx-input .options=${{ suffixIcon, suffixFill }}>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
    </oryx-input>
  `;
};
export const SuffixIcon = Template.bind({});
SuffixIcon.args = {
  suffixIcon: 'search',
  suffixFill: false,
  disabled: false,
} as Props;
