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
    <h1>Column layout</h1>

    <ul>
      <li>On large screens (e.g. desktop) the layout uses 12 columns</li>
      <li>On medium screens (e.g. tablet) the layout uses 8 columns</li>
      <li>On small screens (e.g. mobile) the layout uses 4 columns</li>
      <li>
        Custom column count can be configured using the design system tokens or
        by applying custom column count
      </li>
      <li>
        The layout gap is applied to have space between the items (10px in all
        the examples on this page)
      </li>
    </ul>

    <oryx-layout layout="column"> ${generateLayoutItems(12)} </oryx-layout>

    <ul>
      <li>Padding can be added by standard css to the</li>
    </ul>

    <oryx-layout layout="column" .options=${{ rules: [{ padding: '10px' }] }}>
      ${generateLayoutItems(12)}
    </oryx-layout>

    <ul>
      <li>Border does not affect the column width (1, border-width: 5px)</li>
      <li>Padding does not affect the column width (2, padding: 40px)</li>
      <li>Outline does not affect the column width nor the gap</li>
    </ul>

    <oryx-layout layout="column">
      <div style="border:5px solid var(--oryx-color-secondary-9)">1</div>
      <div style="padding:20px;background:var(--oryx-color-secondary-9)">2</div>
      <div style="outline:1px solid blue;outline-offset: 5px;">4</div>
      ${generateLayoutItems(4, 4)}
    </oryx-layout>

    <ul>
      <li>Custom height can be applied (1)</li>
      <li>
        Items are aligned at the start by default, but can be overridden (2-4)
      </li>
    </ul>

    <oryx-layout layout="column">
      <div style="height:100px;background:var(--oryx-color-secondary-9)">1</div>
      <div style="align-self:center;background:var(--oryx-color-secondary-9)">
        2 (center)
      </div>
      <div style="align-self:end;background:var(--oryx-color-secondary-9)">
        3 (end)
      </div>
      <div style="align-self:stretch;background:var(--oryx-color-secondary-9)">
        4 (str)
      </div>
      ${generateLayoutItems(6, 5)}
    </oryx-layout>

    <ul>
      <li>Columns can be spanned (2, --col-span: 2)</li>
    </ul>
    <oryx-layout layout="column">
      <div>1</div>
      <div style="--col-span:2;background:var(--oryx-color-secondary-9)">
        2/3
      </div>
      ${generateLayoutItems(4, 4)}
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
    <oryx-layout layout="column" style="--oryx-column-count: 6">
      <div>1</div>
      <div style="--span:2;">2</div>
      ${generateLayoutItems(12, 3)}
    </oryx-layout>

    ${generateNestedLayout(CompositionLayout.Column)}

    <style>
      ${layoutStaticStyles}
    </style>
  `;
};

export const Column = Template.bind({});
