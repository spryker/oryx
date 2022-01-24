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
  disabled,
  styleClass,
}: Props): TemplateResult => {
  return html`
    <oryx-input class=${styleClass}>
      <input placeholder="Placeholder..." ?disabled=${disabled} /> />
      <oryx-icon slot="prefix" type="search"></oryx-icon>
      <p slot="prefix">more...</p>
    </oryx-input>
  `;
};
export const PrefixContent = Template.bind({});
PrefixContent.args = {
  disabled: false,
  styleClass: 'prefix-fill',
};
