import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import {
  a11yConfig,
  queryAssignedElements,
  queryFirstAssigned,
} from '@spryker-oryx/typescript-utils';
import { TemplateResult } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { PageNavigationComponent } from '../../page-navigation';
import { PageNavigationItemComponent } from '../../page-navigation-item';
import './../../page-navigation-item';
import './index';

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
