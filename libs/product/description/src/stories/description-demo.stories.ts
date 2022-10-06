import { ProductComponentProperties } from '@spryker-oryx/product';
import { MockProductService } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Description`,
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
