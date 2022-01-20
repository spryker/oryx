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
    <oryx-input class=${suffixFill ? 'suffix-fill' : ''} ?disabled=${disabled}>
      <input placeholder="placeholder text" />
      <span slot="suffix">suffix</span>
    </oryx-input>
  `;
};
export const SuffixFill = Template.bind({});
SuffixFill.args = {
  suffixFill: true,
  disabled: false,
};
