import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { html } from 'lit-html';
import { storybookPrefix } from '../../../../../.constants';

import { TabComponent } from '../../../../tab/src/index';
import { TabsComponent } from '../../index';

interface Props {
  [key: string]: string;
}
export default {
  title: `${storybookPrefix}/Navigations/Tabs/Interactive`,
} as Meta;

const Template: Story<Props> = (): TemplateResult => {
  return html`<oryx-tabs>
      ${Array.from(new Array(5).keys()).map((key) => {
        return html`<oryx-tab for="n${key + 1}"> Tab ${key + 1}</oryx-tab>`;
      })}
    </oryx-tabs>
    ${Array.from(new Array(5).keys()).map((key) => {
      return html`<oryx-tab-panel id="n${key + 1}"
        >Content for tab ${key + 1}</oryx-tab-panel
      >`;
    })} `;
};

export const TabsInteractive = Template.bind({});

TabsInteractive.play = async (obj: {
  args: Props;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const wait = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const component = obj.canvasElement.querySelector(
    'oryx-tabs'
  ) as TabsComponent;

  const navItems = obj.canvasElement.querySelectorAll(
    'oryx-tab'
  ) as NodeListOf<TabComponent>;

  await component.updateComplete;

  for (const navItem of navItems) {
    userEvent.click(navItem);
    await wait(1000);
  }
};
