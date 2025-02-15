import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductIdOptions } from '../id.model';

export default {
  title: `${storybookPrefix}/Id`,
  args: {
    sku: '1',
  },
  argTypes: {
    prefix: { control: { type: 'text' } },
    sku: {
      control: { type: 'select' },
      options: [
        ...MockProductService.mockProducts.map((p) => p.sku),
        'not-found',
      ],
      table: { category: 'demo' },
    },
  },
} as Meta;

type Props = ProductIdOptions & ProductComponentProperties;

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { sku, ...options } = props;
  return html`<oryx-product-id
    .sku=${sku}
    .options=${options}
  ></oryx-product-id>`;
};

export const IdDemo = Template.bind({});
