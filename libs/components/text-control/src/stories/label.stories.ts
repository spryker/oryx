import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../index';
import { Props } from './model';

export default {
  title: 'TextControl',
} as Meta;

const Template: Story<Props> = ({ label }: Props): TemplateResult => {
  return html`
  <oryx-text-control label="${label}">
      <input placeholder="placeholder..."></input>
  </oryx-text-control>`;
};
export const WithLabel = Template.bind({});

WithLabel.args = {
  label: 'label',
};
