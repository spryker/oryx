import { useComponent } from '@spryker-oryx/core/utilities';
import { setUpMockProviders } from '@spryker-oryx/injector';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { mockProductProviders } from '../../../src/mocks';
import { productLabelsComponent } from '../label.def';
import { ProductLabelsAttributes } from '../label.model';

useComponent(productLabelsComponent);

export default {
  title: `${storybookPrefix}/Labels`,
  loaders: [setUpMockProviders(mockProductProviders)],

  argTypes: {
    included: {
      control: { type: 'text' },
    },
    excluded: {
      control: { type: 'text' },
    },
  },
} as unknown as Meta;

const Template: Story<ProductLabelsAttributes> = ({
  included,
  excluded,
}: ProductLabelsAttributes): TemplateResult => {
  return html`<product-labels
    sku="2"
    .options=${{ included, excluded }}
  ></product-labels>`;
};

export const LabelsDemo = Template.bind({});
