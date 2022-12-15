import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { open } from './utils';

export default {
  title: `${storybookPrefix}/Address Modal`,
  // disables Chromatic's snapshotting on a story level
  parameters: { chromatic: { disableSnapshot: true } },
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <button @click=${open}>Open address book</button>
    <oryx-user-address-modal></oryx-user-address-modal>
  `;
};

export const Demo = Template.bind({});
