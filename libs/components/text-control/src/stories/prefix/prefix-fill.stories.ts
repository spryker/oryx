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

<oryx-text-control ?prefixFill=${prefixFill} >
    <input placeholder="Placeholder..." ?disabled=${disabled}></input>
    <span slot="prefix">prefix</span>
  </oryx-text-control>
        `;
};
export const PrefixFill = Template.bind({});
PrefixFill.args = {
  prefixFill: true,
  disabled: false,
};
