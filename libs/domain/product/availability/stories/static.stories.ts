import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../.constants';

export default {
  title: `${storybookPrefix}/Availability`,
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <section>
      <span>no indicator</span>
      <span>no exact count</span>
      <span></span>
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
        `
      )}
    </section>
    <style>
      section {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }
    </style>
  `;
};

export const Static = Template.bind({});
