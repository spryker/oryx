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
    <h1>List layout</h1>

    <ul>
      <li>List items are rendered 100% width</li>
      <li>
        The layout gap is applied to have space between the items (10px in all
        the examples on this page)
      </li>
    </ul>

    <oryx-layout layout="list">
      <div>1</div>
      <oryx-layout layout-sticky>
        <div style="background:var(--oryx-color-secondary-9);">2 (sticky)</div>
      </oryx-layout>
      ${generateLayoutItems(5)}
    </oryx-layout>

    ${generateNestedLayout('list')}

    <style>
      ${layoutStaticStyles}
    </style>
  `;
};

export const List = Template.bind({});
