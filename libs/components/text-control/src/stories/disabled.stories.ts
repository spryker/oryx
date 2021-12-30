import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../index';
import { Props } from './model';

export default {
  title: 'form/TextControl',
} as Meta;

const Template: Story<Props> = ({ disabled }: Props): TemplateResult => {
  return html`
<oryx-text-control label="label">
  <oryx-icon slot="prefix" type="search"></oryx-icon>
  <input placeholder="Placeholder..." ?disabled=${disabled} ></input>
</oryx-text-control>
      `;
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};
