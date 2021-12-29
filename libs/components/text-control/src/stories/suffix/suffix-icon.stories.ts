import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../model';

export default {
  title: 'TextControl/suffix',
} as Meta;

const Template: Story<Props> = ({
  suffixFill,
  suffixIcon,
  disabled,
}: Props): TemplateResult => {
  return html`
<oryx-text-control ?suffixFill="${suffixFill}" suffixIcon=${suffixIcon}>
  <input placeholder="Placeholder..." ?disabled=${disabled}></input>
</oryx-text-control>
  `;
};
export const SuffixIcon = Template.bind({});
SuffixIcon.args = {
  suffixIcon: 'search',
  suffixFill: false,
  disabled: false,
};
