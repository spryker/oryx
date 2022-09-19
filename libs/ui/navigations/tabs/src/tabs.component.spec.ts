import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import {
  a11yConfig,
  queryAssignedElements,
} from '@spryker-oryx/typescript-utils';
import { TabComponent, tabComponent } from '@spryker-oryx/ui/tab';
import {
  TabPanelComponent,
  tabPanelComponent,
} from '@spryker-oryx/ui/tab-panel';
import { vi } from 'vitest';
import { TabsComponent } from './tabs.component';
import { tabsComponent } from './tabs.def';

/** scrollIntoView is not implemented in jsdom */
Element.prototype.scrollIntoView = vi.fn();

describe('Tab component', () => {
  let element: TabsComponent;

  const numberOfTabs = 3;

  beforeAll(async () => {
    await useComponent([tabsComponent, tabComponent, tabPanelComponent]);
  });

  describe('when tabs and panels are defined', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-tabs>
          ${[...Array(numberOfTabs).keys()].map((i) => {
            return html`<oryx-tab for="n${i + 1}">Tab ${i + 1}</oryx-tab> `;
          })}
        </oryx-tabs>

        ${[...Array(numberOfTabs).keys()].map((i) => {
          return html`<oryx-tab-panel id="n${i + 1}"
            >Сontent for tab ${i + 1}</oryx-tab-panel
          > `;
        })}
      `);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should select first tab as default', async () => {
      const slottedItems = queryAssignedElements(element) as TabComponent[];

      const defaultSlotContent = slottedItems[0];
      expect(defaultSlotContent).toHaveProperty('selected', true);
    });

    it('should select first panel as default', async () => {
      const slottedPanels = element.panels as TabPanelComponent[];

      const defaultSlotPanelContent = slottedPanels[0];
      expect(defaultSlotPanelContent).toHaveProperty('selected', true);
    });

    it('should have appearance primary theme as default', async () => {
      expect(element).toHaveProperty('appearance', 'primary');
    });

    describe('when a different tab is selected', () => {
      const selectTabIndex = 1;

      beforeEach(() => {
        const slottedItems = queryAssignedElements(element) as TabComponent[];
        slottedItems[selectTabIndex].click();
      });

      it('should select second tab', async () => {
        const slottedItems = queryAssignedElements(element) as TabComponent[];

        const defaultSlotContent = slottedItems[selectTabIndex];
        expect(defaultSlotContent).toHaveProperty('selected', true);
      });

      it('should select second panel', async () => {
        const slottedPanels = element.panels as TabPanelComponent[];

        const defaultSlotPanelContent = slottedPanels[selectTabIndex];
        expect(defaultSlotPanelContent).toHaveProperty('selected', true);
      });
    });
  });

  describe('when tabs are defined with active index and shadow', () => {
    const activeTabIndex = 2;
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-tabs
          shadow="true"
          activeTabIndex="${activeTabIndex}"
          appearance="secondary"
        >
          ${[...Array(numberOfTabs).keys()].map((i) => {
            return html`<oryx-tab for="n${i + 1}">Tab ${i + 1}</oryx-tab> `;
          })}
        </oryx-tabs>
      `);
    });

    it('should select the active index tab', async () => {
      const slottedItems = queryAssignedElements(element) as TabComponent[];

      const defaultSlotContent = slottedItems[activeTabIndex];
      expect(defaultSlotContent).toHaveProperty('selected', true);
    });

    it('should have a shadow', async () => {
      expect(element).toHaveProperty('shadow', true);
    });

    it('should have appearance secondary theme as default', async () => {
      expect(element).toHaveProperty('appearance', 'secondary');
    });
  });
});
