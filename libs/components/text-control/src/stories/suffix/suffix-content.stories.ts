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
<oryx-text-control ?suffixFill="${suffixFill}">
  <input placeholder="Placeholder..." ?disabled=${disabled}></input>
  <oryx-icon slot="suffix" type="search"></oryx-icon>
  <p slot="suffix">more...</p>
</oryx-text-control>
      `;
};
export const SuffixContent = Template.bind({});
SuffixContent.args = {
  suffixFill: false,
  disabled: false,
};
