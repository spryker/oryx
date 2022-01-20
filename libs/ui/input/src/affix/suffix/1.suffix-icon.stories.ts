import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../../stories/model';

export default {
  title: 'form/input/suffixed',
} as Meta;

const Template: Story<Props> = ({
  suffixFill,
  suffixIcon,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input
      class=${suffixFill ? 'suffix-fill' : ''}
      suffixIcon=${suffixIcon}
    >
      <input placeholder="Placeholder..." ?disabled=${disabled} />
    </oryx-input>
  `;
};
export const SuffixIcon = Template.bind({});
SuffixIcon.args = {
  suffixIcon: 'search',
  suffixFill: false,
  disabled: false,
};
