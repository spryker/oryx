import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { setupProductMocks } from '../../../src/mocks';
import { Props } from '../id.model';
import '../index';

export default {
  title: `${storybookPrefix}/Product Id`,
  loaders: [setupProductMocks],
} as unknown as Meta;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`<product-id
    .sku=${props.sku}
    .options=${{ prefix: props.prefix }}
  ></product-id>`;
};

export const ProductIdDemo = Template.bind({});

ProductIdDemo.args = {
  sku: '1',
  prefix: 'SKU',
};
