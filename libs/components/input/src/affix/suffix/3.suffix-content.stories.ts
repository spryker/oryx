import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../../stories/model';

export default {
  title: 'form/input/suffixed',
} as Meta;

const Template: Story<Props> = ({
  suffixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
<oryx-input class=${suffixFill ? 'suffix-fill' : ''}>
  <input placeholder="Placeholder..." ?disabled=${disabled}></input>
  <oryx-icon slot="suffix" type="search"></oryx-icon>
  <p slot="suffix">more...</p>
</oryx-input>
      `;
};
export const SuffixContent = Template.bind({});
SuffixContent.args = {
  suffixFill: false,
  disabled: false,
};
