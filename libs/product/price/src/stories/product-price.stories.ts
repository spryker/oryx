import { resolve } from '@spryker-oryx/injector';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { LocaleService } from '@spryker-oryx/site';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductPriceOptions } from '../price.model';

export default {
  title: `${storybookPrefix}/Price`,
} as unknown as Meta;

type Props = ProductPriceOptions &
  ProductComponentProperties & { locale: string };

const Template: Story<Props> = (props): TemplateResult => {
  resolve(LocaleService).set(props.locale);

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
