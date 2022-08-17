import { useComponent } from '@spryker-oryx/core/utilities';
import { getInjector } from '@spryker-oryx/injector';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { LocaleService } from '@spryker-oryx/site';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { MockProductService } from '../../../src/mocks';
import { setupProductMocks } from '../../../src/mocks/product.mock';
import { productPriceComponent } from '../component';
import { ProductPriceOptions } from '../price.model';

useComponent(productPriceComponent);

export default {
  title: `${storybookPrefix}/Price`,
  loaders: [setupProductMocks],
} as unknown as Meta;

type Props = ProductPriceOptions &
  ProductComponentProperties & { locale: string };

const getLocale = (): LocaleService => {
  return getInjector().inject(LocaleService);
};

const Template: Story<Props> = (props): TemplateResult => {
  getLocale().set(props.locale);

  return html`<product-price
    .sku=${props.sku}
    .options=${{ hideOriginal: props.hideOriginal }}
  ></product-price>`;
};

export const PriceDemo = Template.bind({});

PriceDemo.args = {
  sku: '1',
  hideOriginal: false,
  locale: 'en-EN',
};

PriceDemo.argTypes = {
  sku: {
    control: { type: 'select' },
    options: [
      ...MockProductService.mockProducts.map((p) => p.sku),
      'not-found',
    ],
    table: { category: 'product' },
  },
  locale: {
    control: { type: 'select' },
    options: ['nl-NL', 'en-EN', 'en-US', 'de-DE'],
  },
};
