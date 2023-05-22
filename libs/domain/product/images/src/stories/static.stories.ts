import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  ProductImagesComponentOptions,
  ProductImagesNavigationAlignment as PINA,
  ProductImagesNavigationPosition as PINP,
} from '../images.model';

export default {
  title: `${storybookPrefix}/Images/Static`,
  parameters: {
    chromatic: {
      delay: 2000,
    },
  },
} as Meta;

let renderCount = 0;

const render = (
  options: ProductImagesComponentOptions,
  sku = '3'
): TemplateResult => {
  return html`
    <oryx-product-images
      title=${JSON.stringify(options)}
      .sku=${sku}
      .options=${{ ...options, groupName: `i-${renderCount++}` }}
    ></oryx-product-images>
  `;
};

const positions = [PINP.Start, PINP.Top, PINP.End, PINP.Bottom];
const alignments = [PINA.Start, PINA.Center, PINA.End];

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <h1>Product images configurations</h1>
    <small>hover over the element to see the configuration</small>
    <div class="stories">${render({}, '1')}</div>

    <style>
      .stories {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .static {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 10px;
        margin: 10px;
      }

      h2 {
        margin-top: 30px;
      }

      product-images {
        flex: 1;
        background-color: lightgray;
      }
    </style>
  `;
};

export const Static = Template.bind({});
