import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { TabComponent } from './tab.component';
import { tabComponent } from './tab.def';

describe('Tab component', () => {
  let element: TabComponent;

  beforeAll(async () => await useComponent([tabComponent]));

  describe('when tab is defined', () => {
    beforeEach(async () => {
      element = await fixture(html` <oryx-tab> tab content </oryx-tab> `);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });
  });
});
