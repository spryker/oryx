import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { generateLayoutItems } from '../util';
import { pageStyles } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static/Examples`,
};

const generateThumbs = (
  layout: string,
  cssClass: string,
  vertical = false,
  style?: string
): TemplateResult => {
  return html`<oryx-layout
    layout=${layout}
    ?layout-vertical=${vertical}
    class=${cssClass}
    style=${style}
  >
    ${generateLayoutItems(8, 1, 'img ')}
  </oryx-layout>`;
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Product images</h1>

    <h2>Navigation at the top</h2>
    <div class="page">
      <oryx-layout layout="list">
        ${generateThumbs('carousel', 'thumbs')}
        ${generateThumbs('carousel', 'main')}
      </oryx-layout>
      <oryx-layout layout="list">
        ${generateThumbs('grid', 'thumbs')}
        ${generateThumbs('carousel', 'main')}
      </oryx-layout>
      <oryx-layout layout="list" layout-overlap>
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('carousel', 'thumbs', false, 'place-self:start;')}
      </oryx-layout>
      <oryx-layout layout="list" layout-overlap>
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('grid', 'thumbs', false, 'place-self:start;')}
      </oryx-layout>
    </div>

    <h2>Navigation at the end</h2>
    <div class="page">
      <div style="display:grid;grid-template-columns: 1fr auto;">
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('carousel', 'thumbs', true)}
      </div>
      <div style="display:grid;grid-template-columns: 1fr auto;">
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('grid', 'thumbs', true)}
      </div>
      <oryx-layout style="grid-template-columns: 1fr auto;" layout-overlap>
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('carousel', 'thumbs', true, 'margin-inline: auto 0;')}
      </oryx-layout>
      <oryx-layout style="grid-template-columns: 1fr auto;" layout-overlap>
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('grid', 'thumbs', true, 'margin-inline: auto 0;')}
      </oryx-layout>
    </div>

    <h2>Navigation at the bottom</h2>
    <div class="page">
      <oryx-layout layout="list">
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('carousel', 'thumbs')}
      </oryx-layout>
      <oryx-layout layout="list">
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('grid', 'thumbs')}
      </oryx-layout>
      <oryx-layout layout="list" layout-overlap>
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('carousel', 'thumbs', false, 'place-self:end;')}
      </oryx-layout>
      <oryx-layout layout="list" layout-overlap>
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('grid', 'thumbs', false, 'place-self:end;')}
      </oryx-layout>
    </div>

    <h2>Navigation at the start</h2>
    <div class="page">
      <oryx-layout style="display:grid;grid-template-columns: auto 1fr ;">
        ${generateThumbs('carousel', 'thumbs', true)}
        ${generateThumbs('carousel', 'main')}
      </oryx-layout>
      <oryx-layout style="display:grid;grid-template-columns:  auto 1fr;">
        ${generateThumbs('grid', 'thumbs', true)}
        ${generateThumbs('carousel', 'main')}
      </oryx-layout>
      <oryx-layout style="grid-template-columns: auto 1fr ;" layout-overlap>
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('carousel', 'thumbs', true, 'margin-inline: 0 auto;')}
      </oryx-layout>
      <oryx-layout style="grid-template-columns: auto 1fr ;" layout-overlap>
        ${generateThumbs('carousel', 'main')}
        ${generateThumbs('grid', 'thumbs', true, 'margin-inline: 0 auto;')}
      </oryx-layout>
    </div>

    <h2>Navigation vertical</h2>
    <div class="page">
      <oryx-layout layout="list">
        ${generateThumbs('carousel', 'thumbs')}
        ${generateThumbs('carousel', 'main', true)}
      </oryx-layout>
      <oryx-layout style="display:grid;grid-template-columns: auto 1fr ;">
        ${generateThumbs('carousel', 'thumbs', true)}
        ${generateThumbs('carousel', 'main', true)}
      </oryx-layout>
      <oryx-layout layout="list" layout-overlap>
        ${generateThumbs('carousel', 'main', true)}
        ${generateThumbs('carousel', 'thumbs', false, 'place-self:start;')}
      </oryx-layout>
      <oryx-layout style="display:grid;grid-template-columns:  auto 1fr;">
        ${generateThumbs('grid', 'thumbs', true)}
        ${generateThumbs('carousel', 'main', true)}
      </oryx-layout>
    </div>

    ${pageStyles}

    <style>
      .page {
        --image-height: 200px;

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-flow: row;
        gap: 10px;
        margin: 10px 0;
      }

      .main {
        --oryx-column-count: 1;
        --h: 200px;

        width: 100%;
      }

      .thumbs {
        --h: 50px;
        --oryx-grid-item-size: var(--h);
      }

      *[layout-vertical] {
        /*
        fix height is required to calculate the number of items that can be distributed
        but also for control the height of the carousel items
        */
        height: var(--image-height);
      }
    </style>
  `;
};

export const ProductImagesPage = Template.bind({});

// .page > oryx-layout {
//         height: var(--image-height);
//       }
