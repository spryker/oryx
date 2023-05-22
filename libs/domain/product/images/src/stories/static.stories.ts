import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  ProductImagesComponentOptions,
  ProductImagesMainLayout,
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
    <div class="stories">
      <h2>Standard behaviour (no config)</h2>
      <div class="static">
        ${render({}, '1')} ${render({})} ${render({}, 'single-image')}
      </div>

      <h2>Main layout</h2>
      <div class="static">
        ${[
          ProductImagesMainLayout.Carousel,
          ProductImagesMainLayout.Toggle,
          ProductImagesMainLayout.None,
        ].map((mainLayout) => render({ imageLayout: mainLayout }))}
      </div>

      <h2>Alignment in carousel navigation</h2>
    </div>

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
