import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constant';
import '../../../index';

export default {
  title: `${storybookPrefix}/form/form-control/suffixed`,
} as Meta;

interface Props {
  disabled: boolean;
  styleClass: string;
}

const Template: Story<Props> = ({
  styleClass,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input class=${styleClass} ?disabled=${disabled}>
      <input placeholder="placeholder text" />
      <span slot="suffix">suffix</span>
    </oryx-input>
  `;
};
export const SuffixFill = Template.bind({});
SuffixFill.args = {
  styleClass: 'suffix-fill',
  disabled: false,
};
