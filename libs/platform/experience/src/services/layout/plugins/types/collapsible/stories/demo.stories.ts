import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../../../../../.constants';

export default {
  title: `${storybookPrefix}/Layout/Collapsible`,
  args: {},
  argTypes: {},
  parameters: { chromatic: { disableSnapshot: true } },
} as Meta;

const Template: Story = (): TemplateResult => {
  const options = {
    rules: [{ layout: { type: 'collapsible' } }],
  };
  return html`
    <oryx-layout .options=${options}>
      <p>The content</p>
    </oryx-layout>
  `;
};

export const Demo = Template.bind({});
