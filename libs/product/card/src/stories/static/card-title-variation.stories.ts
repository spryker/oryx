import { setUpMockProviders } from '@spryker-oryx/injector';
import { mockProductProviders } from '@spryker-oryx/product/mocks';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Card/Static`,
  loaders: [setUpMockProviders(mockProductProviders)],
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h4>With lengthy title</h4>
    <product-card sku="6"></product-card>

    <h4>Without lengthy title</h4>
    <product-card sku="1"></product-card>
  `;
};

export const Title = Template.bind({});
