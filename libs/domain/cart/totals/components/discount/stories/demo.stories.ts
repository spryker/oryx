import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/components/discount`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-cart-totals-discount></oryx-cart-totals-discount>`;
};

export const demo = Template.bind({});
