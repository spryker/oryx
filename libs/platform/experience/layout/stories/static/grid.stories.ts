import { CompositionLayout } from '@spryker-oryx/experience';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../.constants';
import { layoutStaticStyles } from './styles';
import { generateLayoutItems, generateNestedLayout } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Grid layout</h1>

    <ul>
      <li>On large screens (e.g. desktop) the layout uses 4 columns</li>
      <li>On medium screens (e.g. tablet) the layout uses 2 columns</li>
      <li>On small screens (e.g. mobile) the layout uses 1 columns</li>
      <li>
        The layout gap is applied to have space between the grid items (10px in
        all the examples on this page)
      </li>
    </ul>

    <oryx-layout layout="grid"> ${generateLayoutItems(12)} </oryx-layout>

    <ul>
      <li>Padding can be added by standard css</li>
    </ul>

    <oryx-layout layout="grid" .options=${{ rules: [{ padding: '10px' }] }}>
      ${generateLayoutItems(12)}
    </oryx-layout>

    <ul>
      <li>Border does not affect the column width (1, border-width: 5px)</li>
      <li>Margin does not affect the column width (2, margin: 10px)</li>
      <li>Padding does not affect the column width (3, padding: 40px)</li>
      <li>Outline does not affect the column width nor the gap (4)</li>
      <li>
        The grid will hide all overflowed content though (unless a span is used)
      </li>
    </ul>

    <oryx-layout layout="grid">
      <div style="border:5px solid var(--oryx-color-secondary-9)">1</div>
      <div style="margin:10px;background:var(--oryx-color-secondary-9);">2</div>
      <div style="padding:40px;background:var(--oryx-color-secondary-9);">
        3
      </div>
      <div style="outline:1px solid blue;outline-offset: 5px;">4</div>
      ${generateLayoutItems(4, 5)}
    </oryx-layout>

    <ul>
      <li>Custom height can be applied (1)</li>
      <li>Margin does not affect the column width (c2)</li>
      <li>Items are stretched by default, but can be overridden (2-4)</li>
    </ul>

    <oryx-layout layout="grid">
      <div style="height:100px;background:var(--oryx-color-secondary-9);">
        1
      </div>
      <div style="align-self:center;background:var(--oryx-color-secondary-9);">
        2 (center)
      </div>
      <div style="align-self:end;background:var(--oryx-color-secondary-9);">
        3 (end)
      </div>
      <div style="align-self:stretch;background:var(--oryx-color-secondary-9);">
        4 (stretch)
      </div>
      ${generateLayoutItems(6, 5)}
    </oryx-layout>

    <ul>
      <li>Columns can be spanned (2, span: 2)</li>
    </ul>
    <oryx-layout layout="grid">
      <div>1</div>
      <div style="--col-span:2;background:var(--oryx-color-secondary-9);">
        2
      </div>
      ${generateLayoutItems(4, 3)}
    </oryx-layout>

    <h3>Custom column count</h3>
    <ul>
      <li>
        Column count can be customised (
        <pre>--oryx-column-count: 6</pre>
        )
      </li>
      <li>Column span reflects the new column size</li>
    </ul>
    <oryx-layout layout="grid" .options=${{ rules: [{ columnCount: 6 }] }}>
      <div>1</div>
      <div style="grid-column: span 2;">2</div>
      ${generateLayoutItems(12, 3)}
    </oryx-layout>

    ${generateNestedLayout(CompositionLayout.Grid)}

    <style>
      ${layoutStaticStyles}
    </style>
  `;
};

export const Grid = Template.bind({});
