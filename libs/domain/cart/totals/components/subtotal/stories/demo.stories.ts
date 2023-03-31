import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/components/subtotal`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-cart-totals-subtotal></oryx-cart-totals-subtotal>`;
};

export const demo = Template.bind({});
