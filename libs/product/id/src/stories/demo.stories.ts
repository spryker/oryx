import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { setupProductMocks } from '../../../src/mocks';
import { productIdComponent } from '../component';
import { Props } from '../id.model';

useComponent(productIdComponent);

export default {
  title: `${storybookPrefix}/Id`,
  loaders: [setupProductMocks],
} as unknown as Meta;

const Template: Story<Props> = (props: Props): TemplateResult => {
  return html`<product-id
    .sku=${props.sku}
    .options=${{ prefix: props.prefix }}
  ></product-id>`;
};

export const IdDemo = Template.bind({});

IdDemo.args = {
  sku: '1',
  prefix: 'SKU',
};
