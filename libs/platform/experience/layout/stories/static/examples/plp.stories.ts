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
    <h1>Product Listing Page</h1>

    <oryx-layout class="page">
      ${generateHeader()}

      <oryx-layout
        .options=${{
          rules: [{ layout: { type: 'split', columnWidthType: 'aside' } }],
        }}
      >
        <oryx-layout layout="list" layout-sticky style="top: 100px;">
          ${generateLayoutItems(5, 1, 'Facet')}
        </oryx-layout>

        <oryx-layout layout="list">
          <oryx-layout layout="flex">
            <div style=" margin-inline: auto 0;">sort</div>
          </oryx-layout>

          <oryx-layout layout="grid"> ${generateLayoutItems(12)} </oryx-layout>

          <oryx-layout layout="flex">
            <div style=" margin-inline: auto;">pagination</div>
          </oryx-layout>
        </oryx-layout>
      </oryx-layout>
    </oryx-layout>

    ${pageStyles}
  `;
};

export const ProductListingPage = Template.bind({});
