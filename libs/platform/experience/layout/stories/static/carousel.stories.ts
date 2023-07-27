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
    <h1>Carousel layout</h1>

    <h2>Column based layout</h2>

    <ul>
      <li>On large screens (e.g. desktop) the layout uses 4 columns</li>
      <li>On medium screens (e.g. tablet) the layout uses 3 columns</li>
      <li>On small screens (e.g. mobile) the layout uses 2 columns</li>
      <li>
        Carousel items are calculated based on the container size of the page,
        and are not affected by the real estate of the inner components (margin,
        border)
      </li>
      <li>
        The layout gap is applied to have space between the carousel items (10px
        in all the examples on this page)
      </li>
    </ul>

    <oryx-layout layout="carousel">${generateLayoutItems(12)}</oryx-layout>

    <ul>
      <li>Padding can be added using standard CSS</li>
      <li>
        The scroll start position can be set with a variable (--scroll-start:
        10px) (TODO: we will automate this going forward in case carousel layout
        is used)
      </li>
    </ul>

    <oryx-layout layout="carousel" .options=${{ rules: [{ padding: '10px' }] }}>
      ${generateLayoutItems(12)}
    </oryx-layout>

    <ul>
      <li>Border does not affect the column width (1, border-width: 5px)</li>
      <li>Margin does not affect the column width (2, margin: 10px)</li>
      <li>Padding does not affect the column width (3, padding: 40px)</li>
      <li>Outline does not affect the column width nor the gap</li>
      <li>
        The carousel will hide all overflowed content though (unless a span is
        used)
      </li>
    </ul>

    <oryx-layout layout="carousel">
      <div style="border:5px solid var(--oryx-color-secondary-9);">1</div>
      <div style="margin:20px;background:var(--oryx-color-secondary-9);">2</div>
      <div style="padding:40px;background:var(--oryx-color-secondary-9);">
        3
      </div>
      <div style="outline:1px solid blue;outline-offset: 5px;">4</div>
      ${generateLayoutItems(4, 5)}
    </oryx-layout>

    <ul>
      <li>Custom height can be applied (1: 100px, 2:75px)</li>
      <li>
        Items are aligned at the start by default, but can be overridden (2:
        center, 3: end, 4: stretch)
      </li>
    </ul>

    <oryx-layout layout="carousel">
      <div style="height:100px;background:var(--oryx-color-secondary-9);">
        1
      </div>
      <div
        style="height:75px;align-self:center;background:var(--oryx-color-secondary-9);"
      >
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
      <li>Columns can be spanned and keep the column alignment (2, span: 2)</li>
    </ul>
    <oryx-layout layout="carousel">
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
    <oryx-layout layout="carousel" .options=${{ rules: [{ columnCount: 6 }] }}>
      <div>1</div>
      <div style="grid-column:span 2;background:var(--oryx-color-secondary-9);">
        2
      </div>
      ${generateLayoutItems(12, 3)}
    </oryx-layout>

    <h2>Custom item size</h2>

    <h3>Static item size</h3>
    <ul>
      <li>Column count (--oryx-column-count) can be overridden</li>
      <li>custom size is used instead (--oryx-grid-item-size: 100px)</li>
      <li>Columns can be spanned</li>
    </ul>
    <oryx-layout layout="carousel" style="--oryx-grid-item-size: 100px">
      <div>1</div>
      <div style="--span:2;background:var(--oryx-color-secondary-9);">2</div>
      ${generateLayoutItems(12, 3)}
    </oryx-layout>

    <h3>Dynamic item size</h3>
    <ul>
      <li>
        If both columns and item size is not used, the content is taken charge
      </li>
      <li>Columns/row spanning is not a thing in this layout</li>
    </ul>
    <oryx-layout layout="carousel" style="--oryx-grid-item-size: auto;">
      <div>1</div>
      <div style="width: 250px;background:var(--oryx-color-secondary-9);">
        2 (width: 250px)
      </div>

      ${generateLayoutItems(13, 3, 'prefix')}
    </oryx-layout>

    ${generateNestedLayout(CompositionLayout.Carousel)}

    <style>
      ${layoutStaticStyles}
    </style>
  `;
};

export const Carousel = Template.bind({});
