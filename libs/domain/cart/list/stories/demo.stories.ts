import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/List`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <oryx-cart-list></oryx-cart-list>
  `;
};

export const Demo = Template.bind({});
