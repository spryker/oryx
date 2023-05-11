import { CompositionLayout } from '@spryker-oryx/experience';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../constants';
import { layoutStaticStyles } from './styles';
import { generateLayoutItems, generateNestedLayout } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Split-column layout</h1>

    <ul>
      <li>Split-column layout uses two columns under the hood</li>
      <li>
        The odd column is calculated by the
        <pre>--split-column-factor</pre>
      </li>
      <li>Even columns take the rest of the columns</li>
      <li>Split columns change to a single column on small screens</li>
    </ul>

    <h2>Split column auto (default)</h2>
    <oryx-layout layout="split-column">
      <div>1</div>
      <oryx-layout sticky>
        <div style="background:var(--oryx-color-secondary-300)">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(5, 3)}
    </oryx-layout>

    <h2>Split column 50%</h2>
    <oryx-layout layout="split-column" style="--split-column-factor:0.5">
      <div>1</div>
      <oryx-layout sticky>
        <div style="background:var(--oryx-color-secondary-300)">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(5, 3)}
    </oryx-layout>

    <h2>Split column 25%</h2>
    <oryx-layout layout="split-column" style="--split-column-factor:0.25">
      <div>1</div>
      <oryx-layout sticky>
        <div style="background:var(--oryx-color-secondary-300)">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(5)}
    </oryx-layout>

    <h2>Split column 33%</h2>
    <oryx-layout layout="split-column" style="--split-column-factor1/3">
      <div>1</div>
      <oryx-layout sticky>
        <div style="background:var(--oryx-color-secondary-300)">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(5)}
    </oryx-layout>

    <h2>Split column 66%</h2>
    <oryx-layout layout="split-column" style="--split-column-factor:calc(2/3)">
      <div>1</div>
      <oryx-layout sticky>
        <div style="background:var(--oryx-color-secondary-300)">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(5)}
    </oryx-layout>

    <h2>Split column 0.75</h2>
    <oryx-layout layout="split-column" style="--split-column-factor:0.75">
      <div>1</div>
      <oryx-layout sticky>
        <div style="background:var(--oryx-color-secondary-300)">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(5)}
    </oryx-layout>

    ${generateNestedLayout(CompositionLayout.SplitColumn)}

    <!-- <h1>Nested layouts</h1>

    <h2>Nested list</h2>
    <oryx-layout layout="split-column">
      <oryx-layout layout="list">
        ${generateLayoutItems(3, 1, 'c')}
      </oryx-layout>
      <div>2</div>
    </oryx-layout>

    <h2>Nested column</h2>
    <ul>
      <li>
        Nested layouts continue to calculate their columns size based on the
        layout column (as long as there's a wrapper (oryx-composition) that
        replicates the layout).
      </li>
    </ul>

    <oryx-layout layout="split-column" style="--split-column-factor:calc(1/3)">
      <oryx-layout layout="column">
        ${generateLayoutItems(12, 1, 'n1-')}
      </oryx-layout>
      <oryx-layout layout="column">
        ${generateLayoutItems(12, 1, 'n2-')}
      </oryx-layout>
    </oryx-layout>

    <h2>Nested split-column</h2>
    <ul>
      <li>Nested split-column layouts have the same proportions.</li>
      <li>
        A wrapping element is required to avoid conflict with the parent layout,
        but this can be an element that is outside the flow (display:contents).
      </li>
    </ul>

    <oryx-layout layout="split-column">
      <oryx-layout layout="split-column">
        ${generateLayoutItems(2, 1, 'c')}
      </oryx-layout>
      <div>2</div>
    </oryx-layout>


    <h2>Nested grid</h2>

    <ul>
      <li style="color:red">Not supported</li>
    </ul>

    <h2>Nested carousel</h2>

    <ul>
      <li style="color:red">Not supported</li>
    </ul> -->

    <style>
      ${layoutStaticStyles}
    </style>
  `;
};

export const SplitColumn = Template.bind({});
