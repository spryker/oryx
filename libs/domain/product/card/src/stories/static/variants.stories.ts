import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit-html';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Card/Static`,
} as unknown as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <style>
      ul {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        list-style: none;
        margin: none;
        padding: none;
      }
      li {
        flex: 0 0 320px;
      }
    </style>
    <ul>
      <li>
        <h4>Product card</h4>
        <product-card sku="1"></product-card>
      </li>
      <li class="pseudo-hover">
        <h4>Focused/Hovered</h4>
        <product-card sku="1"></product-card>
      </li>
      <li>
        <h4>With zero rating</h4>
        <product-card sku="5"></product-card>
      </li>
      <li>
        <h4>With lengthy title</h4>
        <product-card
          .options=${{ truncateTitleAfter: 1 }}
          sku="6"
        ></product-card>
      </li>
      <li class="pseudo-hover">
        <h4>With lengthy title hovered</h4>
        <product-card
          sku="6"
          .options=${{ truncateTitleAfter: 1 }}
        ></product-card>
      </li>
      <li>
        <h4>Without labels</h4>
        <product-card sku="5"></product-card>
      </li>
      <li>
        <h4>With fallback image</h4>
        <product-card sku="without-images"></product-card>
      </li>
      <li>
        <h4>Hide labels</h4>
        <product-card sku="1" .options=${{ hideLabels: true }}></product-card>
      </li>
      <li>
        <h4>Hide favorites</h4>
        <product-card
          sku="1"
          .options=${{ hideFavorites: true }}
        ></product-card>
      </li>
      <li>
        <h4>Hide title</h4>
        <product-card sku="1" .options=${{ hideTitle: true }}></product-card>
      </li>
      <li>
        <h4>Hide price</h4>
        <product-card sku="1" .options=${{ hidePrice: true }}></product-card>
      </li>
      <li>
        <h4>Hide rating</h4>
        <product-card sku="1" .options=${{ hideRating: true }}></product-card>
      </li>
      <li>
        <h4>Hide content</h4>
        <product-card
          sku="1"
          .options=${{
            hideTitle: true,
            hidePrice: true,
            hideRating: true,
          }}
        ></product-card>
      </li>
    </ul>
  `;
};

export const Variants = Template.bind({});
