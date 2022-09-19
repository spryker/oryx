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
    <oryx-card>
      <h3 slot="header">Primary tabs</h3>

      <oryx-tabs appearance="primary">
        <oryx-tab for="p1" selected>Tab 1</oryx-tab>
        <oryx-tab for="p2">Tab 2</oryx-tab>
        <oryx-tab for="p3">Tab 3</oryx-tab>
        <oryx-tab for="p4">
          <oryx-icon type="star"></oryx-icon>
          Tab 4</oryx-tab
        >
      </oryx-tabs>

      <oryx-tab-panel id="p1">Сontent for primary tab 1</oryx-tab-panel>
      <oryx-tab-panel id="p2">Сontent for primary tab 2</oryx-tab-panel>
      <oryx-tab-panel id="p3">Сontent for primary tab 3</oryx-tab-panel>
      <oryx-tab-panel id="p4">Сontent for primary tab 4</oryx-tab-panel>
    </oryx-card>

    <oryx-card>
      <h3 slot="header">Secondary tabs</h3>

      <oryx-tabs appearance="secondary">
        <oryx-tab for="s1" selected>Tab 1</oryx-tab>
        <oryx-tab for="s2">Tab 2</oryx-tab>
        <oryx-tab for="s3">Tab 3</oryx-tab>
        <oryx-tab for="s4"> <oryx-icon type="star"></oryx-icon>Tab 4</oryx-tab>
      </oryx-tabs>

      <oryx-tab-panel id="s1">Сontent for secondary tab 1</oryx-tab-panel>
      <oryx-tab-panel id="s2">Сontent for secondary tab 2</oryx-tab-panel>
      <oryx-tab-panel id="s3">Сontent for secondary tab 3</oryx-tab-panel>
      <oryx-tab-panel id="s4">Сontent for secondary tab 4</oryx-tab-panel>
    </oryx-card>

    <style>
      oryx-tabs {
        display: flex;
      }

      oryx-tab-panel {
        padding: 24px;
      }
      oryx-card {
        margin-bottom: 24px;
      }
    </style>
  `;
};

export const TabsInsideCard = Template.bind({});
