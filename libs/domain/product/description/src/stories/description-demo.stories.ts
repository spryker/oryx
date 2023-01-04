import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductDescriptionOptions } from '../model';

export default {
  title: `${storybookPrefix}/Description`,
} as unknown as Meta;

type Props = ProductDescriptionOptions & { sku: string };

const Template: Story<Props> = (props: Props): TemplateResult => {
  const { sku, ...options } = props;
  return html` <product-description .sku=${sku} .options=${options} />`;
};
export const DescriptionDemo = Template.bind({});

DescriptionDemo.args = {
  sku: '1',
  truncateAfter: 3,
  hideToggle: false,
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
