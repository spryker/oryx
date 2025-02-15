import { IconTypes } from '@spryker-oryx/ui/icon';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult, html } from 'lit';
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

    <oryx-tabs activeTabIndex="2">
      <oryx-tab>Tab 1</oryx-tab>
      <oryx-tab>Tab 2</oryx-tab>
      <oryx-tab>Tab 3</oryx-tab>
      <oryx-tab>
        <oryx-icon .type=${IconTypes.Star}></oryx-icon>
        Tab 4</oryx-tab
      >
      <oryx-tab>Tab 5</oryx-tab>

      <div slot="panels">Сontent for primary tab 1</div>
      <div slot="panels">Сontent for primary tab 2</div>
      <div slot="panels">Сontent for primary tab 3</div>
      <div slot="panels">Сontent for primary tab 4</div>
      <div slot="panels">Сontent for primary tab 5</div>
    </oryx-tabs>

    <h3 class="margin-top">Secondary tabs</h3>

    <oryx-tabs activeTabIndex="2" appearance="secondary">
      <oryx-tab>Tab 1</oryx-tab>
      <oryx-tab>Tab 2</oryx-tab>
      <oryx-tab>Tab 3</oryx-tab>
      <oryx-tab>
        <oryx-icon .type=${IconTypes.Star}></oryx-icon>
        Tab 4</oryx-tab
      >
      <oryx-tab>Tab 5</oryx-tab>

      <div slot="panels">Сontent for primary tab 1</div>
      <div slot="panels">Сontent for primary tab 2</div>
      <div slot="panels">Сontent for primary tab 3</div>
      <div slot="panels">Сontent for primary tab 4</div>
      <div slot="panels">Сontent for primary tab 5</div>
    </oryx-tabs>

    <style>
      .margin-top {
        margin-top: 50px;
      }
    </style>
  `;
};

export const ActiveTabIndex = Template.bind({});
