import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../model';

export default {
  title: 'TextControl/suffix',
} as Meta;

const Template: Story<Props> = ({
  suffixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
  <oryx-text-control .suffixFill=${suffixFill} ?disabled=${disabled}>
    <input placeholder="placeholder text"></input>
    <span slot="suffix">suffix</span>
  </oryx-text-control>
        `;
};
export const SuffixFill = Template.bind({});
SuffixFill.args = {
  suffixFill: true,
  disabled: false,
};
