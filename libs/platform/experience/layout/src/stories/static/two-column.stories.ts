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
    <h1>List layout</h1>

    <ul>
      <li>Two column layout uses a column layout system under the hood</li>
      <li>
        Odd columns are setup with design tokens to span the first x columns
        (large screen span 7 columns, medium screen span 5 columns, small
        screens use the full width)
      </li>
      <li>Even columns are setup to take the rest of the columns</li>
      <li style="color:red">
        Limitation: nested layouts are not (yet) supported inside two column
        layouts
      </li>
    </ul>

    <oryx-layout layout="two-column" container>
      <div>1</div>
      <oryx-layout sticky>
        <div style="background:var(--oryx-color-secondary-300)">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(5)}
    </oryx-layout>

    <style>
      ${layoutStaticStyles}
    </style>
  `;
};

export const TwoColumn = Template.bind({});
