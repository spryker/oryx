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
    <h3>Primary tabs</h3>

    <oryx-tabs appearance="primary">
      <oryx-tab for="p1" selected>Tab 1</oryx-tab>
      <oryx-tab for="p2">Tab 2</oryx-tab>
      <oryx-tab for="p3" error="true">Tab 3</oryx-tab>
      <oryx-tab for="p4">
        <oryx-icon type="star"></oryx-icon>
        Tab 4</oryx-tab
      >
      <oryx-tab for="p5">Tab 5</oryx-tab>
      <oryx-tab for="p6">Tab 6</oryx-tab>
      <oryx-tab for="p7">Tab 7</oryx-tab>
      <oryx-tab for="p8">Tab 8</oryx-tab>
      <oryx-tab for="p9">Tab 9</oryx-tab>
      <oryx-tab for="p10">Tab 10</oryx-tab>
    </oryx-tabs>

    <oryx-tab-panel id="p1">Сontent for primary tab 1</oryx-tab-panel>
    <oryx-tab-panel id="p2">Сontent for primary tab 2</oryx-tab-panel>
    <oryx-tab-panel id="p3">Сontent for primary tab 3</oryx-tab-panel>
    <oryx-tab-panel id="p4">Сontent for primary tab 4</oryx-tab-panel>
    <oryx-tab-panel id="p5">Сontent for primary tab 5</oryx-tab-panel>
    <oryx-tab-panel id="p6">Сontent for primary tab 6</oryx-tab-panel>
    <oryx-tab-panel id="p7">Сontent for primary tab 7</oryx-tab-panel>
    <oryx-tab-panel id="p8">Сontent for primary tab 8</oryx-tab-panel>
    <oryx-tab-panel id="p9">Сontent for primary tab 9</oryx-tab-panel>
    <oryx-tab-panel id="p10">Сontent for primary tab 10</oryx-tab-panel>

    <h3>Secondary tabs</h3>

    <oryx-tabs appearance="secondary">
      <oryx-tab for="s1" selected>Tab 1</oryx-tab>
      <oryx-tab for="s2">Tab 2</oryx-tab>
      <oryx-tab for="s3" error="true">Tab 3</oryx-tab>
      <oryx-tab for="s4"> <oryx-icon type="star"></oryx-icon>Tab 4</oryx-tab>
      <oryx-tab for="p5">Tab 5</oryx-tab>
      <oryx-tab for="p6">Tab 6</oryx-tab>
      <oryx-tab for="p7">Tab 7</oryx-tab>
      <oryx-tab for="p8">Tab 8</oryx-tab>
      <oryx-tab for="p9">Tab 9</oryx-tab>
      <oryx-tab for="p10">Tab 10</oryx-tab>
    </oryx-tabs>

    <oryx-tab-panel id="s1">Сontent for secondary tab 1</oryx-tab-panel>
    <oryx-tab-panel id="s2">Сontent for secondary tab 2</oryx-tab-panel>
    <oryx-tab-panel id="s3">Сontent for secondary tab 3</oryx-tab-panel>
    <oryx-tab-panel id="s4">Сontent for secondary tab 4</oryx-tab-panel>
    <oryx-tab-panel id="s5">Сontent for secondary tab 5</oryx-tab-panel>
    <oryx-tab-panel id="s6">Сontent for secondary tab 6</oryx-tab-panel>
    <oryx-tab-panel id="s7">Сontent for secondary tab 7</oryx-tab-panel>
    <oryx-tab-panel id="s8">Сontent for secondary tab 8</oryx-tab-panel>
    <oryx-tab-panel id="s9">Сontent for secondary tab 9</oryx-tab-panel>
    <oryx-tab-panel id="s10">Сontent for secondary tab 10</oryx-tab-panel>

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

export const ManyTabs = Template.bind({});
