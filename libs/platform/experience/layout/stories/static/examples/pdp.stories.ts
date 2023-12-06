import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { generateLayoutItems } from '../util';
import { generateHeader, pageStyles } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static/Examples`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Product Detail Page layout</h1>

    <oryx-layout class="page">
      ${generateHeader()}

      <oryx-layout
        .options=${{
          rules: [{ layout: { type: 'split', columnWidthType: 'main' } }],
        }}
      >
        <oryx-layout layout="list">
          <oryx-layout
            layout="carousel"
            style="--oryx-column-count:1;--h:200px"
          >
            ${generateLayoutItems(8, 1, 'image ')}
          </oryx-layout>

          <oryx-layout
            class="thumbs"
            layout="carousel"
            style="--oryx-grid-item-size: 100px;"
          >
            ${generateLayoutItems(8, 1, 'thumb ')}
          </oryx-layout>
        </oryx-layout>
        <oryx-layout layout-sticky layout="list" style="top:120px">
          <div>name</div>
          <div>price</div>
          <div>stock</div>
        </oryx-layout>
      </oryx-layout>

      <h3>recommendations (carousel)</h3>
      <oryx-layout layout="carousel" layout-bleed>
        ${generateLayoutItems(12)}
      </oryx-layout>

      <h3>inspiration grid</h3>
      <oryx-layout layout="grid" layout-bleed style="--cols:5;--h:100px">
        ${generateLayoutItems(10)}
      </oryx-layout>

      <h3>others bought (carousel)</h3>
      <oryx-layout layout="carousel"> ${generateLayoutItems(12)} </oryx-layout>

      <h3>more stuff (carousel)</h3>
      <oryx-layout layout="carousel"> ${generateLayoutItems(12)} </oryx-layout>
    </oryx-layout>

    ${pageStyles}

    <style>
      .thumbs div {
        height: auto;
        aspect-ratio: 1/1;
      }
    </style>
  `;
};

export const ProductPage = Template.bind({});
