import { getInjector } from '@spryker-oryx/injector';
import {
  LocaleService,
  ProductComponentProperties,
} from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../.constants';
import { MockProductService } from '../../../src/mocks';
import { setupProductMocks } from '../../../src/mocks/product.mock';
import '../index';
import { ProductPriceContent } from '../price.model';

export default {
  title: `${storybookPrefix}/Price`,
  loaders: [setupProductMocks],
} as unknown as Meta;

type Props = ProductPriceContent &
  ProductComponentProperties & { locale: string };

const getLocale = (): LocaleService => {
  return getInjector().inject(LocaleService);
};

const Template: Story<Props> = (props): TemplateResult => {
  getLocale().set(props.locale);

  return html`<product-price
    .sku=${props.sku}
    .content=${{ original: props.original }}
  ></product-price>`;
};

export const PriceDemo = Template.bind({});

PriceDemo.args = {
  sku: '1',
  original: true,
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
