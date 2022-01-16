import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../../index';
import { Props } from '../../stories/model';

export default {
  title: 'form/input/prefixed',
} as Meta;

const Template: Story<Props> = ({
  disabled,
  prefixFill,
}: Props): TemplateResult => {
  return html`
<oryx-input class=${prefixFill ? 'prefix-fill' : ''}>
  <input placeholder="Placeholder..." ?disabled=${disabled}></input>
  <oryx-icon slot="prefix" type="search"></oryx-icon>
  <p slot="prefix">more...</p>
</oryx-input>
      `;
};
export const PrefixContent = Template.bind({});
PrefixContent.args = {
  prefixFill: false,
  disabled: false,
};
