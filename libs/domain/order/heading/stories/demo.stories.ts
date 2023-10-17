import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Heading`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-order-heading></oryx-order-heading>`;
};

export const Demo = Template.bind({});
