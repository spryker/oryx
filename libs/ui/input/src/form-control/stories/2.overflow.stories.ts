import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../constant';
import '../index';

export default {
  title: `${storybookPrefix}/form/input`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult =>
  html`
    <oryx-input label="Label" style="width: 200px;">
      <input
        placeholder="Placeholder"
        value="this text is too long and won't be completely visible"
      />
    </oryx-input>
  `;
export const TextWithOverflow = Template.bind({});
