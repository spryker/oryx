import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Labels/Static`,
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Nothing included</h3>
    <oryx-product-labels sku="1"></oryx-product-labels>
    <h3>"Sale" included</h3>
    <oryx-product-labels
      sku="1"
      .options=${{ included: 'sale' }}
    ></oryx-product-labels>
    <h3>Nothing excluded</h3>
    <oryx-product-labels sku="1"></oryx-product-labels>
    <h3>"Sale" excluded</h3>
    <oryx-product-labels
      sku="1"
      .options=${{ excluded: 'sale' }}
    ></oryx-product-labels>
  `;
};

export const LabelVariationsDemo = Template.bind({});
