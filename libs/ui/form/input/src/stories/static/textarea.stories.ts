import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.storybook/constant';
import '../../form-control';

export default {
  title: `${storybookPrefix}/form/textarea`,
} as Meta;
interface Props {
  disabled: boolean;
}

const Template: Story<Props> = ({ disabled }: Props): TemplateResult =>
  html`
    <oryx-input label="label">
      <textarea placeholder="Placeholder" ?disabled=${disabled}></textarea>
    </oryx-input>
  `;
export const Textarea = Template.bind({});
Textarea.args = {
  disabled: false,
};
