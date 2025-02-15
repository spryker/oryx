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
    <oryx-card heading="Primary tabs">
      <oryx-tabs appearance="primary">
        <oryx-tab>Tab 1</oryx-tab>
        <oryx-tab>Tab 2</oryx-tab>
        <oryx-tab>Tab 3</oryx-tab>
        <oryx-tab>
          <oryx-icon .type=${IconTypes.Star}></oryx-icon>
          Tab 4</oryx-tab
        >
        <div slot="panels">Сontent for primary tab 1</div>
        <div slot="panels">Сontent for primary tab 2</div>
        <div slot="panels">Сontent for primary tab 3</div>
        <div slot="panels">Сontent for primary tab 4</div>
      </oryx-tabs>
    </oryx-card>

    <oryx-card heading="Secondary tabs">
      <oryx-tabs appearance="secondary">
        <oryx-tab>Tab 1</oryx-tab>
        <oryx-tab>Tab 2</oryx-tab>
        <oryx-tab>Tab 3</oryx-tab>
        <oryx-tab>
          <oryx-icon .type=${IconTypes.Star}></oryx-icon>Tab 4</oryx-tab
        >
        <div slot="panels">Сontent for secondary tab 1</div>
        <div slot="panels">Сontent for secondary tab 2</div>
        <div slot="panels">Сontent for secondary tab 3</div>
        <div slot="panels">Сontent for secondary tab 4</div>
      </oryx-tabs>
    </oryx-card>
  `;
};

export const TabsInsideCard = Template.bind({});
