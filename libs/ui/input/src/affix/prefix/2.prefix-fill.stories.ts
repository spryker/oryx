import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../../stories/model';

export default {
  title: 'form/input/prefixed',
} as Meta;

const Template: Story<Props> = ({
  prefixFill,
  disabled,
}: Props): TemplateResult => {
  return html`
    <oryx-input class=${prefixFill ? 'prefix-fill' : ''}>
      <input placeholder="Placeholder..." ?disabled=${disabled} />
      <span slot="prefix">prefix</span>
    </oryx-input>
  `;
};
export const PrefixFill = Template.bind({});
PrefixFill.args = {
  prefixFill: true,
  disabled: false,
};
