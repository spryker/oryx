import { MockProductCategoryService } from '@spryker-oryx/product/mocks';
import { Meta } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';
import { ProductCategoryLinkOptions } from '../category-link.model';

export default {
  title: `${storybookPrefix}/Category Link`,
  args: {
    category: MockProductCategoryService.mockCategories[0].id,
  },
  argTypes: {
    category: {
      control: { type: 'select' },
      options: [...MockProductCategoryService.mockCategories.map((p) => p.id)],
    },
  },
} as Meta;

const Template = (props: ProductCategoryLinkOptions): TemplateResult => {
  return html`<oryx-product-category-link
    .category=${props.category}
  ></oryx-product-category-link>`;
};

export const IdDemo = Template.bind({});
