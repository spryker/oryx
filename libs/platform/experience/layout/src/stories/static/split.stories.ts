import { CompositionLayout } from '@spryker-oryx/experience';
import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { layoutStaticStyles } from './styles';
import { generateLayoutItems, generateNestedLayout } from './util';

export default {
  title: `${storybookPrefix}/Layout/Static`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Split layout</h1>

    <ul>
      <li>The global column system under the hood</li>
      <li>
        The first column is calculated, so that it aligns with other grids on
        the page
      </li>
      <li>There are 3 sub layouts: equal, main and aside split</li>
      <li>Split columns is not applied on sm screens</li>
    </ul>

    <h2>Split (default)</h2>

    <ul>
      <li>
        The
        <pre>column-split-equal</pre>
        token is used
      </li>
      <li>Uses 6 columns on lg and 4 on md</li>
    </ul>
    <oryx-layout layout="split"> ${generateLayoutItems(5)} </oryx-layout>

    <h2>Split aside</h2>
    <ul>
      <li>
        The
        <pre>column-split-aside</pre>
        token is used
      </li>
      <li>Uses 3 columns on lg and 2 on md</li>
    </ul>
    <oryx-layout layout="split-aside"> ${generateLayoutItems(5)} </oryx-layout>

    <h2>Split main</h2>
    <ul>
      <li>
        The
        <pre>column-split-main</pre>
        token is used
      </li>
      <li>Uses 8 columns on lg and 5 on md</li>
    </ul>
    <oryx-layout layout="split-main"> ${generateLayoutItems(5)} </oryx-layout>

    <h2>Span</h2>
    <oryx-layout layout="split-main">
      <div style="grid-column:span 2">1</div>
      ${generateLayoutItems(3, 3)}
    </oryx-layout>

    <h2>Sticky</h2>
    <oryx-layout layout="split-main">
      <div style="grid-column:span 2">1</div>
      <oryx-layout layout-sticky>
        <div style="background:var(--oryx-color-secondary-9);">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(3, 3)}
    </oryx-layout>

    ${generateNestedLayout(CompositionLayout.Split)}

    <style>
      ${layoutStaticStyles}
    </style>
  `;
};

export const Split = Template.bind({});
