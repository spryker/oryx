import { queryFirstAssigned, wait } from '@spryker-oryx/utilities';
import { expect } from '@storybook/jest';
import { PageNavigationItemComponent } from '../../../../../../navigation/page-navigation-item';
import { PageNavigationItem, getNavItems } from '../../common';
import { TemplateProps } from '../common';

export const assertSync = (
  predictActiveNavItem: PageNavigationItem,
  activeNavItem: PageNavigationItemComponent
): void => {
  const heading = activeNavItem.renderRoot?.querySelector(
    'slot:not([name])'
  ) as HTMLSlotElement;
  expect(
    heading
      ?.assignedNodes()
      .map((node) => node.textContent)
      .join('')
      .trim()
  ).toEqual(predictActiveNavItem.heading);

  const content = queryFirstAssigned(activeNavItem, {
    slot: 'content',
  }) as HTMLSpanElement;
  expect(content?.textContent).toEqual(predictActiveNavItem.content);
};

export const playStory = async (
  canvasElement: HTMLElement,
  { sectionsCount, sectionHeight, viewportHeight }: TemplateProps
): Promise<void> => {
  const navItems = getNavItems(sectionsCount);
  const sectionsContainer = window.document.querySelector('.scroll-container');

  expect(sectionsContainer).not.toBeNull();
  if (!sectionsContainer) return;

  const getActiveNavItem = (): PageNavigationItemComponent => {
    return canvasElement.querySelector(
      'oryx-page-navigation-item[active]'
    ) as PageNavigationItemComponent;
  };

  const fullyVisibleSectionsCount = Math.floor(viewportHeight / sectionHeight);

  for (const [index, navItem] of navItems.entries()) {
    if (fullyVisibleSectionsCount <= 1 && index + 1 !== navItems.length) {
      sectionsContainer.scrollTo({ top: sectionHeight * index });
      await wait(1000);
      assertSync(navItem, getActiveNavItem());

      const edgePosition = sectionHeight * (index + 1) - viewportHeight / 2;

      sectionsContainer.scrollTo({ top: edgePosition - 1 });
      await wait(1000);
      assertSync(navItem, getActiveNavItem());

      sectionsContainer.scrollTo({ top: edgePosition + 1 });
      await wait(1000);
      assertSync(navItems[index + 1], getActiveNavItem());
    } else if (
      fullyVisibleSectionsCount > 1 &&
      index < navItems.length - fullyVisibleSectionsCount
    ) {
      const edgePosition = sectionHeight * index;

      sectionsContainer.scrollTo({ top: edgePosition });
      await wait(1000);
      assertSync(navItem, getActiveNavItem());

      sectionsContainer.scrollTo({ top: edgePosition + 1 });
      await wait(1000);
      assertSync(navItems[index + 1], getActiveNavItem());
    }
  }
};
