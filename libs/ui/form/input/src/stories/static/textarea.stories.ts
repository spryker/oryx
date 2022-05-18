import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import '../../form-control';

export default {
  title: `${storybookPrefix}/Form/Textarea`,
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
