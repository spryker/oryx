import { ProductComponentProperties } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { MockProductService, setupProductMocks } from '../../../src/mocks';
import '../index';
import { ProductDescriptionContent } from '../model';

export default {
  title: `${storybookPrefix}/Description`,
  loaders: [setupProductMocks],
} as unknown as Meta;

type Props = ProductDescriptionContent & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`<product-description .sku=${props.sku} .content=${props} />`;
};
export const DescriptionDemo = Template.bind({});

DescriptionDemo.args = {
  sku: '1',
  truncateCharacterCount: 100,
};

DescriptionDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
  },
  truncateCharacterCount: {
    description: '100',
  },
};
