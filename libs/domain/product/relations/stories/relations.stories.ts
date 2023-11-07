import { ContextService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ProductContext } from '@spryker-oryx/product';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Relations`,
  argTypes: {
    sku: {
      control: { type: 'select' },
      options: ['1', '2', '5'],
      defaultValue: '1',
    },
  },
  chromatic: { disableSnapshot: true },
} as Meta;

interface Props {
  sku: string;
}

const Template: Story<Props> = ({ sku }: Props): TemplateResult => {
  resolve(ContextService).provide(document.body, ProductContext.SKU, { sku });

  return html`<oryx-product-relations></oryx-product-relations>`;
};

export const RelationsDemo = Template.bind({});
