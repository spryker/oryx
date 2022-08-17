import { useComponent } from '@spryker-oryx/core/utilities';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { MockProductService, setupProductMocks } from '../../../src/mocks';
import { productDescriptionComponent } from '../component';

useComponent(productDescriptionComponent);

export default {
  title: `${storybookPrefix}/Description`,
  loaders: [setupProductMocks],
} as unknown as Meta;

type Props = ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`<product-description .sku=${props.sku} .options=${props} />`;
};
export const DescriptionDemo = Template.bind({});

DescriptionDemo.args = {
  sku: '1',
  truncateAfter: 3,
  showToggle: true,
};

DescriptionDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
  },
};
