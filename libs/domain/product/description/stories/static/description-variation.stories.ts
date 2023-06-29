import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';

export default {
  title: `${storybookPrefix}/Description/Static`,
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <div class="variation-description">
      <p>Collapsed</p>
      <oryx-product-description
        sku="1"
        .options=${{ lineClamp: 2 }}
      ></oryx-product-description>
    </div>
    <div class="variation-description">
      <p>No Truncation</p>
      <oryx-product-description
        sku="1"
        .options=${{ lineClamp: Infinity }}
      ></oryx-product-description>
    </div>

    <style>
      .variation-description {
        display: flex;
        margin-bottom: 24px;
        gap: 15px;
      }

      .variation-description p {
        width: 180px;
      }
    </style>
  `;
};

export const descriptionVariation = Template.bind({});
