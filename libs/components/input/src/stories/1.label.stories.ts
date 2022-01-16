import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../index';
import { Props } from './model';

export default {
  title: 'form/input',
} as Meta;

const Template: Story<Props> = ({ label }: Props): TemplateResult => {
  return html`
  <oryx-input label="${label}">
      <input placeholder="placeholder..."></input>
  </oryx-input>`;
};
export const Label = Template.bind({});

Label.args = {
  label: 'label',
};
