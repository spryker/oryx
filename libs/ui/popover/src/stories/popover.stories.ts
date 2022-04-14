import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.storybook/constant';
import '../index';

export default {
  title: `${storybookPrefix}/form/utilities/Popover`,
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-popover show>
      <oryx-option>First value is looooong</oryx-option>
      <oryx-option>2nd</oryx-option>
      <oryx-option>3rd</oryx-option>
    </oryx-popover>
  `;
};
export const Popover = Template.bind({});
