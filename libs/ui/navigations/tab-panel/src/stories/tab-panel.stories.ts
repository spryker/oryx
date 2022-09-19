import { useComponent } from '@spryker-oryx/core/utilities';
import { Meta, Story } from '@storybook/web-components';
import { html, TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../.constants';
import { tabPanelComponent } from '../index';

useComponent(tabPanelComponent);

export default {
  title: `${storybookPrefix}/Navigations/Tab panel`,
  args: {},
  argTypes: {},
} as Meta;

const Template: Story<unknown> = (): TemplateResult => {
  return html`
    <oryx-tab-panel selected> tab content </oryx-tab-panel>
    <oryx-tab-panel> tab content unselected </oryx-tab-panel>
  `;
};

// export const TabPanelDemo = Template.bind({});
