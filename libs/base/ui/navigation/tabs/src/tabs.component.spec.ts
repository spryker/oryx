import { fixture, html } from '@open-wc/testing-helpers';
import {
  a11yConfig,
  queryAssignedElements,
  useComponent,
} from '@spryker-oryx/utilities';
import { TabComponent } from '../../tab';
import { tabComponent } from '../../tab/src/tab.def';
import { TabsComponent } from './tabs.component';
import { tabsComponent } from './tabs.def';

/** scrollIntoView is not implemented in jsdom */
Element.prototype.scrollIntoView = vi.fn();

describe('Tab component', () => {
  let element: TabsComponent;
  let inputRange: HTMLInputElement | undefined | null;
  const numberOfTabs = 3;

  beforeAll(async () => {
    await useComponent([tabsComponent, tabComponent]);
  });

  describe('when tabs and panels are defined', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-tabs>
          ${[...Array(numberOfTabs).keys()].map((i) => {
            return html`<oryx-tab for="n${i + 1}">Tab ${i + 1}</oryx-tab> `;
          })}
          ${[...Array(numberOfTabs).keys()].map((i) => {
            return html`<div slot="panels" id="n${i + 1}">
              Сontent for tab ${i + 1}
            </div> `;
          })}
        </oryx-tabs>
      `);

      inputRange = element.shadowRoot?.querySelector('input');
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should select first tab as default', async () => {
      const slottedItems = queryAssignedElements(element) as TabComponent[];
      const defaultSlotContent = slottedItems[0];
      expect(defaultSlotContent.hasAttribute('selected')).toBe(true);
    });

    it('should select first panel as default', async () => {
      const slottedPanels = queryAssignedElements(element, { slot: 'panels' });
      const defaultSlotPanelContent = slottedPanels[0];
      expect(defaultSlotPanelContent.hasAttribute('selected')).toBe(true);
    });

    it('should have appearance primary theme as default', async () => {
      expect(element).toHaveProperty('appearance', 'primary');
    });

    describe('when the 2nd tab is selected', () => {
      const selectTabIndex = 1;
      beforeEach(() => {
        const slottedItems = queryAssignedElements(element) as TabComponent[];
        slottedItems[selectTabIndex].click();
      });

      it('should select second tab', async () => {
        const slottedItems = queryAssignedElements(element) as TabComponent[];
        const defaultSlotContent = slottedItems[selectTabIndex];
        expect(defaultSlotContent.hasAttribute('selected')).toBe(true);
      });

      it('should select second panel', async () => {
        const panels = queryAssignedElements(element, { slot: 'panels' });
        const defaultSlotPanelContent = panels[selectTabIndex];
        expect(defaultSlotPanelContent.hasAttribute('selected')).toBe(true);
      });

      it('should set input of type range to be 2', async () => {
        const input = element.shadowRoot?.querySelector(
          'input[type="range"]'
        ) as HTMLInputElement;

        expect(input?.value).toBe('2');
      });
    });

    describe('when the input value changes', () => {
      const selectedTabIndex = 1;
      beforeEach(() => {
        if (inputRange) {
          inputRange.value = '2';
          inputRange.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      it('should select second tab', async () => {
        const slottedItems = queryAssignedElements(element) as TabComponent[];
        const defaultSlotContent = slottedItems[selectedTabIndex];
        expect(defaultSlotContent.hasAttribute('selected')).toBe(true);
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
        expect(defaultSlotContent.hasAttribute('selected')).toBe(true);
      });

      it('should have a shadow', async () => {
        expect(element).toHaveProperty('shadow', true);
      });

      it('should have appearance secondary theme as default', async () => {
        expect(element).toHaveProperty('appearance', 'secondary');
      });
    });

    describe('when tabs are defined without for attribute', () => {
      beforeEach(async () => {
        element = await fixture(html`
          <oryx-tabs>
            ${[...Array(numberOfTabs).keys()].map((i) => {
              return html`<oryx-tab>Tab ${i + 1}</oryx-tab> `;
            })}
            ${[...Array(numberOfTabs).keys()].map((i) => {
              return html`<div slot="panels" id="n${i + 1}">
                Сontent for tab ${i + 1}
              </div> `;
            })}
          </oryx-tabs>
        `);
      });

      it('should select the panels by index', async () => {
        const slottedPanels = queryAssignedElements(element, {
          slot: 'panels',
        });
        const defaultSlotPanelContent = slottedPanels[0];
        expect(defaultSlotPanelContent.hasAttribute('selected')).toBe(true);
      });
    });
  });
});
