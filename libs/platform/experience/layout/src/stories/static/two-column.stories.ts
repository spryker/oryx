import { Story } from '@storybook/web-components';

import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../constants';
import { layoutStaticStyles } from './styles';
import { generateLayoutItems } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Two column layout</h1>

    <ul>
      <li>Two column layout uses a column layout system under the hood</li>
      <li>
        Odd columns are setup with design tokens to span the first x columns
        (large screen span 7 columns, medium screen span 5 columns, small
        screens use the full width)
      </li>
      <li>Even columns are setup to take the rest of the columns</li>
    </ul>

    <oryx-layout layout="two-column" container>
      <div>1</div>
      <oryx-layout sticky>
        <div style="background:var(--oryx-color-secondary-300)">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(5)}
    </oryx-layout>

    <h1>Nested layouts</h1>

    <h2>Nested list</h2>
    <oryx-layout layout="two-column" container>
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

    <oryx-layout layout="two-column" container>
      <oryx-composition style="display:contents;" layout="column">
        <oryx-layout layout="column">
          ${generateLayoutItems(12, 1, 'n1-')}
        </oryx-layout>
      </oryx-composition>
      <oryx-layout layout="column">
        ${generateLayoutItems(12, 1, 'n2-')}
      </oryx-layout>
    </oryx-layout>

    <h2>Nested two-column</h2>
    <ul>
      <li>Nested two-column layouts have the same proportions.</li>
      <li>
        A wrapping element is required to avoid conflict with the parent layout,
        but this can be an element that is outside the flow (display:contents).
      </li>
    </ul>

    <oryx-layout layout="two-column" container>
      <oryx-composition layout="two-column" style="display:contents;">
        <oryx-layout layout="two-column">
          ${generateLayoutItems(2, 1, 'c')}
        </oryx-layout>
      </oryx-composition>
      <div>2</div>
    </oryx-layout>

    <h2>Nested grid</h2>

    <ul>
      <li style="color:red">Not supported</li>
    </ul>

    <h2>Nested carousel</h2>

    <ul>
      <li style="color:red">Not supported</li>
    </ul>

    <style>
      ${layoutStaticStyles}
    </style>
  `;
};

export const TwoColumn = Template.bind({});
