import { queryAssignedElements, throttle } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import { PageNavigationItemComponent } from '../../page-navigation-item';
import { PageNavigationProperties } from './page-navigation.model';

interface VisibleSection {
  id: string;
  percent: number;
}

export class PageNavigationController implements ReactiveController {
  constructor(protected host: LitElement & PageNavigationProperties) {
    this.host.addController(this);
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.detectActiveSection = this.detectActiveSection.bind(this);
    this.onScroll = throttle(this.detectActiveSection, 50, true);
  }

  protected onScroll: () => void;
  protected currentSectionId!: string;
  protected navItems: PageNavigationItemComponent[] = [];
  protected disableNavigation!: boolean;
  protected sectionsContainerSelector!: string;

  hostConnected(): void {
    if (!this.host.disableNavigation) this.setNavigationItemsListeners();

    this.disableNavigation = this.host.disableNavigation;

    this.setScrollListener();
  }

  hostUpdated(): void {
    if (this.disableNavigation !== this.host.disableNavigation) {
      if (!this.host.disableNavigation) this.setNavigationItemsListeners();
      else this.removeNavigationItemsListeners();

      this.disableNavigation = this.host.disableNavigation;
    }

    if (
      this.sectionsContainerSelector !== this.host.sectionsContainerSelector
    ) {
      this.navItems = <PageNavigationItemComponent[]>(
        queryAssignedElements(this.host)
      );

      this.detectActiveSection();
    }
  }

  hostDisconnected(): void {
    const sectionsContainer = this.getSectionsContainer();
    if (sectionsContainer)
      sectionsContainer.removeEventListener('scroll', this.onScroll);

    this.removeNavigationItemsListeners();
  }

  protected setScrollListener(): void {
    const sectionsContainer = this.getSectionsContainer();
    if (sectionsContainer)
      sectionsContainer.addEventListener('scroll', this.onScroll);
  }

  protected setNavigationItemsListeners(): void {
    this.host.addEventListener('keydown', this.onKeydown);
    this.host.addEventListener('click', this.onClick);
  }

  protected removeNavigationItemsListeners(): void {
    this.host.removeEventListener('keydown', this.onKeydown);
    this.host.removeEventListener('click', this.onClick);
  }

  protected getSectionsContainer(): HTMLElement | null {
    return window.document.querySelector(this.host.sectionsContainerSelector);
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') this.onNavigationItemActivated(e);
  }

  protected onClick(e: MouseEvent): void {
    this.onNavigationItemActivated(e);
  }

  protected onNavigationItemActivated(e: Event): void {
    const targetId = (e.target as HTMLElement)
      .closest('oryx-page-navigation-item')
      ?.getAttribute('targetId');
    if (targetId) document.getElementById(targetId)?.scrollIntoView();
  }

  protected getVisibleSections(): VisibleSection[] {
    const sectionsContainer = this.getSectionsContainer();
    if (!sectionsContainer) return [];

    const sections: HTMLElement[] = this.getSections(this.navItems);
    const { clientHeight: viewportHeight, scrollTop } = sectionsContainer;

    return sections.reduce((acc: VisibleSection[], section) => {
      const { offsetTop: elOffsetTop, offsetHeight: elHeight } = section;

      if (
        scrollTop < elOffsetTop + elHeight &&
        elOffsetTop < scrollTop + viewportHeight
      ) {
        const hiddenBefore = scrollTop - elOffsetTop;
        const hiddenAfter =
          elOffsetTop + elHeight - (scrollTop + viewportHeight);

        let visibilityPercentage = 100;

        if (hiddenBefore > 0)
          visibilityPercentage -= (hiddenBefore * 100) / elHeight;
        else if (hiddenAfter > 0)
          visibilityPercentage -= (hiddenAfter * 100) / elHeight;

        acc.push({ id: section.id, percent: visibilityPercentage });
      }

      return acc;
    }, []);
  }

  protected getMostVisibleSection(sections: VisibleSection[]): VisibleSection {
    let mostVisibleSection = sections[0];

    for (let i = 1; i < sections.length; i++) {
      if (sections[i].percent > mostVisibleSection.percent)
        mostVisibleSection = sections[i];
    }

    return mostVisibleSection;
  }

  protected emitCurrentSection(id: string): void {
    if (this.currentSectionId !== id) {
      const event = new CustomEvent('section-change', { detail: { id } });
      this.host.dispatchEvent(event);

      this.currentSectionId = id;
    }
  }

  protected detectActiveSection(): void {
    const activeSections = this.getVisibleSections();
    if (!activeSections.length) return;

    const mostVisibleSection = this.getMostVisibleSection(activeSections);

    this.emitCurrentSection(mostVisibleSection.id);

    const navItemToBeActive = this.navItems.find(({ targetId }) => {
      return targetId === mostVisibleSection?.id;
    });

    this.navItems.forEach((navItem) => {
      navItem.toggleAttribute(
        'active',
        !!navItemToBeActive?.targetId &&
          navItem.targetId === navItemToBeActive?.targetId
      );
    });
  }

  protected getSections(
    navItems: PageNavigationItemComponent[]
  ): HTMLElement[] {
    return navItems
      .map(({ targetId }) => {
        return document.querySelector(`#${targetId}`);
      })
      .filter((section) => section) as HTMLElement[];
  }
}
