import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import {
  ProductImagesComponentOptions,
  ProductImagesMainLayout,
  ProductImagesNavigationAlignment as PINA,
  ProductImagesNavigationDisplay as PIND,
  ProductImagesNavigationDisplay,
  ProductImagesNavigationLayout as PINL,
  ProductImagesNavigationPosition as PINP,
  ProductImagesNavigationPosition,
} from '../images.model';

export default {
  title: `${storybookPrefix}/Images/Static`,
  parameters: {
    chromatic: { disableSnapshot: true },
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
          ProductImagesMainLayout.Grid,
          ProductImagesMainLayout.None,
        ].map((mainLayout) => render({ imageLayout: mainLayout }))}
      </div>

      <h2>Alignment in carousel navigation</h2>

      ${alignments.map(
        (navigationAlignment) => html`<h3>${navigationAlignment}</h3>
          <div class="static">
            ${positions.map((navigationPosition) =>
              render({ navigationPosition, navigationAlignment }, '1')
            )}
          </div>`
      )}

      <h2>Alignment in grid navigation</h2>
      ${alignments.map(
        (navigationAlignment) => html`
          <h3>${navigationAlignment}</h3>
          <div class="static">
            ${positions.map((navigationPosition) =>
              render(
                {
                  navigationPosition,
                  navigationAlignment,
                  navigationLayout: PINL.Grid,
                },
                '1'
              )
            )}
          </div>
        `
      )}

      <h2>Navigation display (carousel)</h2>
      <h3>Inline</h3>
      <div class="static">
        ${positions.map((navigationPosition) => render({ navigationPosition }))}
      </div>
      <h3>Floating</h3>
      <div class="static">
        ${positions.map((navigationPosition) =>
          render({
            navigationPosition,
            navigationDisplay: PIND.Floating,
          })
        )}
      </div>
      <h3>None</h3>
      <div class="static">
        ${positions.map((navigationPosition) =>
          render({
            navigationPosition,
            navigationDisplay: PIND.None,
          })
        )}
      </div>

      <h2>Navigation display (grid)</h2>
      <h3>Inline</h3>
      <div class="static">
        ${[PINP.Start, PINP.Top].map((navigationPosition) =>
          render({
            navigationPosition,
            navigationLayout: PINL.Grid,
          })
        )}
      </div>
      <div class="static">
        ${[PINP.End, PINP.Bottom].map((navigationPosition) =>
          render({
            navigationPosition,
            navigationLayout: PINL.Grid,
          })
        )}
      </div>
      <h3>Floating</h3>
      <div class="static">
        ${[PINP.Start, PINP.Top].map((navigationPosition) =>
          render({
            navigationPosition,
            navigationLayout: PINL.Grid,
            navigationDisplay: PIND.Floating,
          })
        )}
      </div>
      <div class="static">
        ${[PINP.End, PINP.Bottom].map((navigationPosition) =>
          render({
            navigationPosition,
            navigationLayout: PINL.Grid,
            navigationDisplay: PIND.Floating,
          })
        )}
      </div>

      <h2>Grid items per column (inline)</h2>
      <div class="static">
        ${[3, 4, 5, 6].map((imagesColumns) =>
          render(
            {
              navigationLayout: PINL.Grid,
              navigationPosition: ProductImagesNavigationPosition.Start,
              imagesColumns,
              navigationHeight: '40px',
            },
            '3'
          )
        )}
      </div>

      <h2>Grid items per column (floating)</h2>
      <div class="static">
        ${[3, 4, 5, 6].map((imagesColumns) =>
          render(
            {
              navigationLayout: PINL.Grid,
              navigationPosition: ProductImagesNavigationPosition.Start,
              navigationDisplay: ProductImagesNavigationDisplay.Floating,
              imagesColumns,
              navigationHeight: '40px',
            },
            '3'
          )
        )}
      </div>

      <h2>Fixed width</h2>
      ${positions.map((navigationPosition) =>
        render(
          {
            navigationPosition,
            imageWidth: '500px',
          },
          '1'
        )
      )}
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
