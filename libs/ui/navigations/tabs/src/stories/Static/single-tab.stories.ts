import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';

export default {
  title: `${storybookPrefix}/Navigations/Tabs/Static`,
  args: {},
  argTypes: {},
} as Meta;

interface Props {
  [key: string]: string;
}

const Template: Story<Props> = (): TemplateResult => {
  return html`
    <h3>Primary tab</h3>

    <oryx-tabs appearance="primary">
      <oryx-tab for="p1" selected>Tab 1</oryx-tab>
    </oryx-tabs>

    <oryx-tab-panel id="p1">Сontent for primary tab 1</oryx-tab-panel>

    <h3>Secondary tab</h3>

    <oryx-tabs appearance="secondary">
      <oryx-tab for="s1" selected>Tab 1</oryx-tab>
    </oryx-tabs>

    <oryx-tab-panel id="s1">Сontent for secondary tab 1</oryx-tab-panel>

    <style>
      oryx-tabs {
        display: flex;
      }
      oryx-tab-panel {
        padding: 24px;
      }
    </style>
  `;
};

export const SingleTab = Template.bind({});
