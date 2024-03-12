import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Manage Address`,
  // disables Chromatic's snapshotting on a story level
  parameters: { chromatic: { disableSnapshot: true } },
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <style>
      oryx-checkout-manage-address {
        display: inline-flex;
      }
    </style>
    <oryx-checkout-manage-address></oryx-checkout-manage-address>
  `;
};

export const Demo = Template.bind({});
