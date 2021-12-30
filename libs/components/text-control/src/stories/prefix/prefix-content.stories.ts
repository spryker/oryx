import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../model';

export default {
  title: 'form/TextControl/Prefixed',
} as Meta;

const Template: Story<Props> = ({
  prefixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
<oryx-text-control .prefixFill="${prefixFill}">
  <input placeholder="Placeholder..." ?disabled=${disabled}></input>
  <oryx-icon slot="prefix" type="search"></oryx-icon>
  <p slot="prefix">more...</p>
</oryx-text-control>
      `;
};
export const PrefixContent = Template.bind({});
PrefixContent.args = {
  prefixFill: false,
  disabled: false,
};
