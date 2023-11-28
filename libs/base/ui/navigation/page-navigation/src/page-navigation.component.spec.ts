import { elementUpdated, fixture, html } from '@open-wc/testing-helpers';
import { pageNavigationItemComponent } from '@spryker-oryx/ui';
import { PageNavigationItemComponent } from '@spryker-oryx/ui/page-navigation-item';
import {
  a11yConfig,
  queryAssignedElements,
  queryFirstAssigned,
  useComponent,
} from '@spryker-oryx/utilities';
import { TemplateResult } from 'lit';
import { pageNavigationComponent } from './component';
import { PageNavigationComponent } from './page-navigation.component';

describe('Page navigation', () => {
  let element: PageNavigationComponent;

  const navigationItems = [
    {
      targetId: 'some-id-1',
      heading: 'Heading 1',
      content: 'Subtitle 1',
    },
    {
      targetId: 'some-id-2',
      heading: 'Heading 2',
      content: 'Subtitle 2',
    },
  ];

  beforeAll(async () => {
    await useComponent([pageNavigationComponent, pageNavigationItemComponent]);
  });

  describe('when navigation items are passed', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <oryx-page-navigation>
          ${navigationItems.map(
            ({ targetId, heading, content }) => html`
              <oryx-page-navigation-item .targetId=${targetId}>
                <span>${heading}</span>
                <span slot="content">${content}</span>
              </oryx-page-navigation-item>
            `
          )}
        </oryx-page-navigation>
      `);
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    navigationItems.forEach((navigationItem, index) => {
      it(`should render navigation item with targetId "${navigationItem.targetId}" properly`, () => {
        const slottedItems = queryAssignedElements(
          element
        ) as PageNavigationItemComponent[];

        const defaultSlotContent = queryFirstAssigned(
          slottedItems[index]
        ) as HTMLSpanElement;
        expect(defaultSlotContent.textContent).toContain(
          navigationItem.heading
        );

        const subtitleSlotContent = queryFirstAssigned(slottedItems[index], {
          slot: 'content',
        }) as HTMLSpanElement;
        expect(subtitleSlotContent.textContent).toContain(
          navigationItem.content
        );
      });
    });
  });

  const getTemplate = (disableNavigation: boolean): TemplateResult => html`
    <div>
      <div id="sections-container">
        ${navigationItems.map(
          ({ targetId }) => html` <section id=${targetId}></section> `
        )}
      </div>
      <oryx-page-navigation
        sectionsContainerSelector="#sections-container"
        ?disableNavigation=${disableNavigation}
      >
        ${navigationItems.map(
          ({ targetId, heading, content }) => html`
            <oryx-page-navigation-item targetId=${targetId}>
              <span>${heading}</span>
              <span slot="content">${content}</span>
            </oryx-page-navigation-item>
          `
        )}
      </oryx-page-navigation>
    </div>
  `;

  describe('when navigation is active', () => {
    let el: HTMLElement;
    const targetId = 'some-id-3';
    const heading = 'Heading 3';
    const content = 'Subtitle 3';

    beforeEach(async () => {
      el = await fixture(getTemplate(false));
    });

    it('should scroll to section on navigation item clicked', () => {
      const navigationElements = el.querySelectorAll(
        'oryx-page-navigation-item'
      ) as NodeListOf<PageNavigationItemComponent>;
      const sections = el.querySelectorAll('#sections-container section');

      sections.forEach((section) => {
        section.scrollIntoView = vi.fn();
      });

      navigationElements.forEach((navigationElement, index) => {
        navigationElement.click();
        expect(sections[index].scrollIntoView).toHaveBeenCalled();
      });
    });

    describe('and navigation items have been changed', () => {
      beforeEach(async () => {
        element = el.querySelector(
          'oryx-page-navigation'
        ) as PageNavigationComponent;
        element.insertAdjacentHTML(
          'beforeend',
          `<oryx-page-navigation-item .targetId=${targetId}>
            <span>${heading}</span>
            <span slot="content">${content}</span>
          </oryx-page-navigation-item>`
        );
        const sectionsContainer = el.querySelector(
          '#sections-container'
        ) as HTMLElement;
        sectionsContainer.insertAdjacentHTML(
          'beforeend',
          `<section id=${targetId}></section>`
        );
        await elementUpdated(el);
      });

      it('should render new navigation item at the end of the list', () => {
        const slottedItems = queryAssignedElements(
          element
        ) as PageNavigationItemComponent[];
        const index = navigationItems.length;

        const defaultSlotContent = queryFirstAssigned(
          slottedItems[index]
        ) as HTMLSpanElement;
        expect(defaultSlotContent.textContent).toContain(heading);

        const subtitleSlotContent = queryFirstAssigned(slottedItems[index], {
          slot: 'content',
        }) as HTMLSpanElement;
        expect(subtitleSlotContent.textContent).toContain(content);
      });
    });
  });

  describe('when navigation is inactive', () => {
    let el: HTMLElement;

    beforeEach(async () => {
      el = await fixture(getTemplate(true));
    });

    it('should not scroll to section when navigation item clicked', () => {
      const navigationElements = el.querySelectorAll(
        'oryx-page-navigation-item'
      ) as NodeListOf<PageNavigationItemComponent>;
      const sections = el.querySelectorAll('#sections-container section');

      sections.forEach((section) => {
        section.scrollIntoView = vi.fn();
      });

      navigationElements.forEach((navigationElement, index) => {
        navigationElement.click();
        expect(sections[index].scrollIntoView).not.toHaveBeenCalled();
      });
    });
  });
});
