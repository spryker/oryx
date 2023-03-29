import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Cart totals/components/tax`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`<oryx-cart-totals-tax></oryx-cart-totals-tax>`;
};

export const demo = Template.bind({});
