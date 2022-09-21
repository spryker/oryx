import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { a11yConfig } from '@spryker-oryx/typescript-utils';
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
