import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';

export default {
  title: 'form/form-control/prefixed',
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
    <oryx-input class=${styleClass}>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
      <span slot="prefix">prefix</span>
    </oryx-input>
  `;
};
export const PrefixFill = Template.bind({});
PrefixFill.args = {
  styleClass: 'prefix-fill',
  disabled: false,
};
