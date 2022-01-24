import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import '../index';

export default {
  title: 'form/textarea',
} as Meta;
interface Props {
  disabled: boolean;
}

const Template: Story<Props> = ({ disabled }: Props): TemplateResult =>
  html`
    <oryx-input label="Label">
      <textarea placeholder="Give me a number" ?disabled=${disabled}></textarea>
    </oryx-input>
  `;
export const Textarea = Template.bind({});
Textarea.args = {
  disabled: false,
};
