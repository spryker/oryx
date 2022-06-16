import { html, TemplateResult } from 'lit';
import '../../../page-navigation-item';
import '../index';

export const getPageNavigation = (
  itemsNumber: number,
  sectionsContainerSelector: string
): TemplateResult => {
  const sections = getNavItems(itemsNumber);

  return html`
    <oryx-page-navigation
      sectionsContainerSelector=${sectionsContainerSelector}
    >
      ${sections.map(
        (section, index) =>
          html`
            <oryx-page-navigation-item targetId=${section.targetId}>
              ${section.heading}
              <span slot="content">${section.content}</span>
            </oryx-page-navigation-item>
          `
      )}
    </oryx-page-navigation>
  `;
};

export interface PageNavigationItem {
  heading: string;
  content: string;
  targetId: string;
}

export const getNavItems = (count: number): PageNavigationItem[] => {
  return [...Array(count).keys()].map((i) => {
    const number = i + 1;

    return {
      heading: `Heading ${number}`,
      content: `Subtitle ${number}`,
      targetId: `link_${number}`,
    };
  });
};
