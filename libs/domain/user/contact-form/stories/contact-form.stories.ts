import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Contact Form`,
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`<user-contact-form></user-contact-form>`;
};

export const Demo = Template.bind({});
