import { Story } from '@storybook/web-components';

import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../constants';
import { generateLayoutItems } from '../util';
import { generateHeader, pageStyles } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static/Examples`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Product Detail Page layout</h1>

    <oryx-layout container class="page">
      ${generateHeader()}

      <oryx-layout layout="two-column">
        <oryx-layout layout="list">
          <div style="min-height:400px;">Product images</div>

          <oryx-layout
            class="thumbs"
            layout="carousel"
            style="--cols:6;--h:50px;"
          >
            ${generateLayoutItems(8)}
          </oryx-layout>
        </oryx-layout>
        <oryx-layout sticky layout="list" style="top:90px">
          <div>name</div>
          <div>price</div>
          <div>stock</div>
        </oryx-layout>
      </oryx-layout>

      <h3>recommendations (carousel)</h3>
      <oryx-layout layout="carousel"> ${generateLayoutItems(12)} </oryx-layout>

      <h3>inspiration grid</h3>
      <oryx-layout layout="grid" style="--cols:5;--h:100px">
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
