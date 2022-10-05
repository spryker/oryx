import { useComponent } from '@spryker-oryx/core/utilities';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { mockProductProviders } from '../../../src/mocks';
import { productLabelsComponent } from '../label.def';

useComponent(productLabelsComponent);

export default {
  title: `${storybookPrefix}/Labels/Static`,
  loaders: [setUpMockProviders(mockProductProviders)],
} as unknown as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h3>Nothing included</h3>
    <product-labels sku="2"></product-labels>
    <h3>"Sale" included</h3>
    <product-labels sku="2" .options=${{ included: 'sale' }}></product-labels>
    <h3>Nothing excluded</h3>
    <product-labels sku="2"></product-labels>
    <h3>"Sale" excluded</h3>
    <product-labels sku="2" .options=${{ excluded: 'sale' }}></product-labels>
  `;
};

export const LabelVariationsDemo = Template.bind({});
