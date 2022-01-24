import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../../index';

export default {
  title: 'form/form-control/prefixed',
} as Meta;
interface Props {
  disabled: boolean;
  styleClass: string;
  prefixIcon: string;
}

const Template: Story<Props> = ({
  prefixIcon,
  styleClass,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input .prefixIcon=${prefixIcon} class=${styleClass}>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
    </oryx-input>
  `;
};
export const PrefixIcon = Template.bind({});
PrefixIcon.args = {
  prefixIcon: 'search',
  styleClass: 'prefix-fill',
  disabled: false,
};
