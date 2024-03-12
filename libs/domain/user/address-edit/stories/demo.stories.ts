import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Address Edit`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-user-address-edit></oryx-user-address-edit>`;
};

export const Demo = Template.bind({});
