import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';
import { ProductDescriptionOptions } from '../description.model';

export default {
  title: `${storybookPrefix}/Description`,
  args: {
    sku: '1',
    lineClamp: 2,
    enableToggle: true,
  },
  argTypes: {
    lineClamp: {
      control: { type: 'number' },
    },
    enableToggle: {
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
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
} as Meta;

type Props = ProductDescriptionOptions & { sku: string };

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { sku, ...options } = props;
  return html` <oryx-product-description .sku=${sku} .options=${options} />`;
};

export const DescriptionDemo = Template.bind({});
