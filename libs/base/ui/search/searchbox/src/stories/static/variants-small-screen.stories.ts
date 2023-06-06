import {
  initMutationObserverForComponent,
  storybookDefaultViewports,
} from '@/tools/storybook';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Search/Searchbox/Static`,
  parameters: {
    chromatic: {
      viewports: [storybookDefaultViewports.mobile.min],
    },
  },
} as Meta;

const Template: Story = (): TemplateResult => {
  return html`
    <h2>Trigger</h2>
    <oryx-search xs-floated>
      <input placeholder="Search..." />
    </oryx-search>

    <h2>Opened</h2>
    <oryx-search open xs-floated>
      <input placeholder="Search..." />
    </oryx-search>

    <h2>Opened with value</h2>
    <oryx-search open xs-floated>
      <input placeholder="Search..."/ value="Value">
    </oryx-search>

    <h2>Not floated</h2>
    <oryx-search> <input placeholder="Search..."/ value="Value"> </oryx-search>

    <script>
      ${initMutationObserverForComponent({
        targetComponent: 'oryx-search',
        targetSelector: '.control',
        sourceSelector: 'input',
      })};
    </script>
  `;
};
export const VariantsSmallScreen = Template.bind({});
