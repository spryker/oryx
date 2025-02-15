import { resolve } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/i18n';
import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductPriceOptions } from '../price.model';

export default {
  title: `${storybookPrefix}/Price`,
  args: {
    sku: '1',
    locale: 'en-EN',
  },
  argTypes: {
    enableOriginalPrice: {
      control: { type: 'boolean' },
    },
    enableVatMessage: {
      control: { type: 'boolean' },
    },
    sku: {
      control: { type: 'select' },
      options: [
        ...MockProductService.mockProducts.map((p) => p.sku),
        'not-found',
      ],
      table: { category: 'demo' },
    },
    locale: {
      control: { type: 'select' },
      options: ['nl-NL', 'en-EN', 'en-US', 'de-DE'],
      table: { category: 'demo' },
    },
  },
} as Meta;

type Props = ProductPriceOptions &
  ProductComponentProperties & { locale: string };

const Template: Story<Props> = (props): TemplateResult => {
  const { sku, locale, ...options } = props;
  resolve(LocaleService).set(locale);

  return html`<oryx-product-price
    .sku=${sku}
    .options=${options}
  ></oryx-product-price>`;
};

export const PriceDemo = Template.bind({});
