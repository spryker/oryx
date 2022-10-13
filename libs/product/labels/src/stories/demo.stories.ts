import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { ProductLabelsAttributes } from '../label.model';

export default {
  title: `${storybookPrefix}/Labels`,

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
    sku="1"
    .options=${{ included, excluded }}
  ></product-labels>`;
};

export const LabelsDemo = Template.bind({});
