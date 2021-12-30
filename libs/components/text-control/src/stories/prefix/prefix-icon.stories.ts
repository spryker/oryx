import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../model';

export default {
  title: 'form/TextControl/Prefixed',
} as Meta;

const Template: Story<Props> = ({
  prefixIcon,
  prefixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
  <oryx-text-control .prefixIcon=${prefixIcon} ?prefixFill=${prefixFill} >
    <input placeholder="Placeholder..." ?disabled=${disabled}></input>
  </oryx-text-control>
        `;
};
export const PrefixIcon = Template.bind({});
PrefixIcon.args = {
  prefixIcon: 'search',
  prefixFill: false,
  disabled: false,
};
