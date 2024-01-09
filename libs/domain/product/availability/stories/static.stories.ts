import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Availability`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <section>
      <span>No indicator</span>
      <span>No exact count</span>
      <span>Exact count</span>
      <span>Hide available</span>
      ${['3', '1', '4'].map(
        (sku) => html`
          <oryx-product-availability
            .sku=${sku}
            .options=${{
              threshold: 5,
              enableIndicator: false,
              enableExactStock: false,
            }}
          ></oryx-product-availability>
          <oryx-product-availability
            .sku=${sku}
            .options=${{
              threshold: 5,
              enableIndicator: true,
              enableExactStock: false,
            }}
          ></oryx-product-availability>
          <oryx-product-availability
            .sku=${sku}
            .options=${{
              threshold: 5,
              enableIndicator: true,
              enableExactStock: true,
            }}
          ></oryx-product-availability>
          <oryx-product-availability
            .sku=${sku}
            .options=${{
              threshold: 5,
              enableIndicator: true,
              enableExactStock: true,
              hideInStock: true,
            }}
          ></oryx-product-availability>
        `
      )}
    </section>
    <style>
      section {
        display: grid;
        grid-template-columns: repeat(4, max-content);
        gap: 10px 20px;
      }
    </style>
  `;
};

export const Static = Template.bind({});
