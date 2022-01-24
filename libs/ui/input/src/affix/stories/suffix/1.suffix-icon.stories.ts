import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../../index';

export default {
  title: 'form/form-control/suffixed',
} as Meta;
interface Props {
  disabled: boolean;
  styleClass: string;
  suffixIcon: string;
}

const Template: Story<Props> = ({
  styleClass,
  suffixIcon,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input class=${styleClass} suffixIcon=${suffixIcon}>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
    </oryx-input>
  `;
};
export const SuffixIcon = Template.bind({});
SuffixIcon.args = {
  suffixIcon: 'search',
  styleClass: 'suffix-fill',
  disabled: false,
};
