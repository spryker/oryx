import { Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';

export default {
  title: `${storybookPrefix}/Layout/Static`,
};

const Template: Story = (): TemplateResult => {
  return html`
    <h1>Tab layout</h1>

    <ul>
      <li></li>
    </ul>
    <oryx-layout layout="tabular" tab-align="start" container>
      <input type="radio" name="group1" id="tab-1" checked />
      <label for="tab-1">heading 1</label>
      <div>
        <p>content 1</p>
        <p>content 2</p>
        <p>content 3</p>
      </div>
      <input type="radio" name="group1" id="tab-2" />
      <label for="tab-2">heading 2</label>
      <div>content 2</div>
    </oryx-layout>

    <oryx-layout layout="tabular" tab-align="center" container>
      <input type="radio" name="group2" id="tab-3" checked />
      <label for="tab-3">heading 1</label>
      <div>content 1</div>
      <input type="radio" name="group2" id="tab-4" />
      <label for="tab-4">heading 2</label>
      <div>
        <p>content 1</p>
        <p>content 2</p>
        <p>content 3</p>
      </div>
    </oryx-layout>

    <oryx-layout layout="tabular" container>
      <input type="radio" name="group3" id="tab-5" checked />
      <label for="tab-5">heading 1</label>
      <div>content 1</div>
      <input type="radio" name="group3" id="tab-6" />
      <label for="tab-6">heading 2</label>
      <div>2nd</div>
      <input type="radio" name="group3" id="tab-6c" />
      <label for="tab-6c">heading 2c</label>
      <div>
        <p>content 1</p>
        <p>content 2</p>
        <p>content 3</p>
      </div>
    </oryx-layout>

    <oryx-layout layout="tabular" layout-vertical container>
      <input type="radio" name="group4" id="tab-7" checked />
      <label for="tab-7">heading 1</label>
      <div>content 1</div>
      <input type="radio" name="group4" id="tab-8" />
      <label for="tab-8">heading 2</label>
      <div>
        <p>content 1</p>
        <p>content 2</p>
        <p>content 3</p>
      </div>
    </oryx-layout>

    <style>
      [layout='tabular']:not([layout-vertical])
        input:not(:checked)
        + label
        + * {
        display: none;
      }
      [layout='tabular'] input:checked + label {
        color: var(--oryx-color-primary-9);
      }

      [layout='tabular'][layout-vertical] *:not(input):not(label) {
        transition: max-height 0.3s;
        overflow: hidden;
        max-height: 100px;
      }

      [layout='tabular'][layout-vertical] input:not(:checked) + label + * {
        max-height: 0;
      }
    </style>
  `;
};

export const Tab = Template.bind({});
