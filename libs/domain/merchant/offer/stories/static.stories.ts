import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Offer List Item`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h2>Full width</h2>

    <h3>No stock, discounted</h3>
    <oryx-merchant-offer sku="mp-1" offerId="offer-1"></oryx-merchant-offer>

    <h3>Available in stock</h3>
    <oryx-merchant-offer sku="mp-2" offerId="offer-2"></oryx-merchant-offer>

    <h2>300px width</h2>
    <div style="width:300px">
      <h3>No stock, discounted</h3>
      <oryx-merchant-offer sku="mp-1" offerId="offer-1"></oryx-merchant-offer>
      <h3>Available in stock</h3>
      <oryx-merchant-offer sku="mp-2" offerId="offer-2"></oryx-merchant-offer>
    </div>
  `;
};

export const Static = Template.bind({});
