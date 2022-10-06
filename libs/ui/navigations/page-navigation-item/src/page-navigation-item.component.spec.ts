import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { a11yConfig, queryFirstAssigned } from '@spryker-oryx/typescript-utils';
import { pageNavigationItemComponent } from './component';
import { PageNavigationItemComponent } from './page-navigation-item.component';

describe('Page navigation item', () => {
  let element: PageNavigationItemComponent;

  beforeAll(async () => {
    await useComponent(pageNavigationItemComponent);
  });

  describe('when slots are filled', () => {
    const heading = 'Heading';
    const content = 'Subtitle';

    beforeEach(async () => {
      element = await fixture(html`<oryx-page-navigation-item>
        <span>${heading}</span>
        <span slot="content">${content}</span>
      </oryx-page-navigation-item>`);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render heading', () => {
      const defaultSlotContent = queryFirstAssigned(element) as HTMLSpanElement;

      expect(defaultSlotContent.textContent).toContain(heading);
    });

    it('should render content with passed text', () => {
      const subtitleSlotContent = queryFirstAssigned(element, {
        slot: 'content',
      }) as HTMLSpanElement;

      expect(subtitleSlotContent.textContent).toContain(content);
    });
  });
});
