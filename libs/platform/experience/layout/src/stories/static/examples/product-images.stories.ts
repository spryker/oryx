import { Story } from '@storybook/web-components';

import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { storybookPrefix } from '../../../../../constants';
import { generateLayoutItems } from '../util';
import { pageStyles } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static/Examples`,
};

const gen = (options?: {
  floating?: boolean;
  thumbLayout?: 'grid' | 'carousel';
  mainLayout?: 'grid' | 'carousel';
  thumbLength?: number;
  position?: 'bottom' | 'top' | 'start' | 'end';
  mainVertical?: boolean;
}) => {
  const thumbs = html`<oryx-layout
    class="thumbs"
    layout=${options?.thumbLayout ?? 'carousel'}
    .vertical=${options?.position === 'start' || options?.position === 'end'}
  >
    ${generateLayoutItems(options?.thumbLength ?? 11)}
  </oryx-layout>`;

  const main = html`<oryx-layout
    class="main"
    layout=${options?.mainLayout ?? 'carousel'}
    .vertical=${options?.mainVertical}
  >
    ${generateLayoutItems(
      options?.thumbLength ?? 12,
      1,
      `thumbs: ${options?.thumbLayout ?? 'carousel'}, main: ${
        options?.mainLayout ?? 'carousel'
      } – `
    )}
  </oryx-layout>`;

  return html` <oryx-layout
    class="product-images ${options?.floating
      ? 'floating'
      : ''} ${options?.position ?? ''}"
  >
    ${when(
      options?.position === 'top' || options?.position === 'start',
      () => html`${thumbs}${main}`,
      () => html`${main}${thumbs}`
    )}
  </oryx-layout>`;
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Product images layout examples</h1>

    <style>
      .product-images {
        --product-image-height: 300px;
        --thumb-size: 50px;
        display: grid;
        align-content: start;
      }

      .product-images .main,
      .product-images .thumbs[vertical],
      .product-images .main div {
        height: var(--product-image-height);
      }

      .product-images .thumbs {
        --cols: initial;
        --item-size: var(--thumb-size);
        background: transparent;
      }

      .product-images .main {
        --cols: 1;
      }

      .product-images.floating > :is(.thumbs, .main) {
        grid-column: 1;
        grid-row: 1;
      }

      .product-images.start {
        grid-template-columns: auto 1fr;
      }

      .product-images.end {
        grid-template-columns: 1fr auto;
      }

      .product-images.start .thumbs {
        justify-self: start;
      }

      .product-images.end .thumbs {
        justify-self: end;
      }

      /* small UI on the sample */

      .product-images .main div {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--oryx-color-primary-300);
      }

      .product-images.floating .thumbs {
        z-index: 1;
      }

      .product-images .thumbs {
        --scroll-start: 10px;
        padding: 10px;
      }

      .product-images.floating.bottom .thumbs {
        align-self: end;
      }

      .page {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-flow: row;
        gap: 10px;
      }
    </style>

    <h2>Navigation at the bottom</h2>

    <div class="page">
      ${gen({ position: 'bottom' })}
      ${gen({ position: 'bottom', thumbLayout: 'grid' })}
      ${gen({ position: 'bottom', floating: true })}
      ${gen({ position: 'bottom', thumbLayout: 'grid', floating: true })}
    </div>

    <h2>Navigation at the start</h2>
    <div class="page">
      ${gen({ position: 'start' })}
      ${gen({ position: 'start', thumbLayout: 'grid' })}
      ${gen({ position: 'start', floating: true })}
      ${gen({ position: 'start', thumbLayout: 'grid', floating: true })}
    </div>

    <h2>Navigation at the top</h2>
    <div class="page">
      ${gen({ position: 'top' })}
      ${gen({ position: 'top', thumbLayout: 'grid' })}
      ${gen({ position: 'top', floating: true })}
      ${gen({ position: 'top', thumbLayout: 'grid', floating: true })}
    </div>

    <h2>Navigation at the end</h2>
    <div class="page">
      ${gen({ position: 'end' })}
      ${gen({ position: 'end', thumbLayout: 'grid' })}
      ${gen({ position: 'end', floating: true })}
      ${gen({ position: 'end', thumbLayout: 'grid', floating: true })}
    </div>

    <h2>Vertical alternatives</h2>

    <div class="page">
      ${gen({ position: 'start', mainVertical: true })}
      ${gen({ position: 'start', mainVertical: true, thumbLayout: 'grid' })}
      ${gen({ position: 'top', mainVertical: true })}
      ${gen({ position: 'top', mainVertical: true, thumbLayout: 'grid' })}
    </div>

    ${pageStyles}

    <style>
      .thumbs div {
        /* height: auto; */
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--thumb-size);
        height: var(--thumb-size);
      }
    </style>
  `;
};

export const ProductImagesPage = Template.bind({});
