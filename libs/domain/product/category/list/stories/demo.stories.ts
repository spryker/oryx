import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductCategoryListOptions } from '../list.model';

export default {
  title: `${storybookPrefix}/Categories`,
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    exclude: '',
  },
  argTypes: {
    id: { control: { type: 'select', options: ['5'] } },
    exclude: { control: { type: 'text' } },
  },
} as Meta;

const Template: Story<ProductCategoryListOptions> = (
  props: ProductCategoryListOptions
): TemplateResult => {
  return html`<oryx-product-category-list
    .options=${props}
  ></oryx-product-category-list>`;
};

export const Demo = Template.bind({});
