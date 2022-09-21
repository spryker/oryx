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
        <oryx-tab>Tab 1</oryx-tab>
        <oryx-tab>Tab 2</oryx-tab>
        <oryx-tab>Tab 3</oryx-tab>
        <oryx-tab>
          <oryx-icon type="star"></oryx-icon>
          Tab 4</oryx-tab
        >
        <div slot="panels">Сontent for primary tab 1</div>
        <div slot="panels">Сontent for primary tab 2</div>
        <div slot="panels">Сontent for primary tab 3</div>
        <div slot="panels">Сontent for primary tab 4</div>
      </oryx-tabs>
    </oryx-card>

    <oryx-card>
      <h3 slot="header">Secondary tabs</h3>

      <oryx-tabs appearance="secondary">
        <oryx-tab>Tab 1</oryx-tab>
        <oryx-tab>Tab 2</oryx-tab>
        <oryx-tab>Tab 3</oryx-tab>
        <oryx-tab> <oryx-icon type="star"></oryx-icon>Tab 4</oryx-tab>
        <div slot="panels">Сontent for secondary tab 1</div>
        <div slot="panels">Сontent for secondary tab 2</div>
        <div slot="panels">Сontent for secondary tab 3</div>
        <div slot="panels">Сontent for secondary tab 4</div>
      </oryx-tabs>
    </oryx-card>
  `;
};

export const TabsInsideCard = Template.bind({});
