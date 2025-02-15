import { wait } from '@spryker-oryx/utilities';
import { expect } from '@storybook/jest';
import { userEvent } from '@storybook/testing-library';
import { Meta, Story } from '@storybook/web-components';
import { TemplateResult } from 'lit';
import { storybookPrefix } from '../../../../../.constants';
import { PageNavigationItemComponent } from '../../../../page-navigation-item';
import { TemplateProps, getTemplate } from './common';

export default {
  title: `${storybookPrefix}/Navigations/Page navigation/Interactive`,
} as Meta;

const templateProps: TemplateProps = {
  sectionsCount: 5,
  sectionHeight: 400,
  viewportHeight: 300,
};

const Template: Story<undefined> = (): TemplateResult => {
  return getTemplate(templateProps);
};

export const SyncOnNavigationItemsClick = Template.bind({});

SyncOnNavigationItemsClick.play = async (obj: {
  args: unknown;
  canvasElement: HTMLElement;
}): Promise<void> => {
  const navItems = obj.canvasElement.querySelectorAll(
    'oryx-page-navigation-item'
  ) as NodeListOf<PageNavigationItemComponent>;

  const sectionsContainer = window.document.querySelector('.scroll-container');
  expect(sectionsContainer).not.toBeNull();

  if (!sectionsContainer) {
    return;
  }

  for (const navItem of navItems) {
    userEvent.click(navItem);
    await wait(1000);

    const section = obj.canvasElement.querySelector(
      `#${navItem.getAttribute('targetId')}`
    ) as HTMLElement;

    const { clientHeight: viewportHeight, scrollTop } = sectionsContainer;
    const { offsetTop: elOffsetTop, offsetHeight: elHeight } = section;

    expect(
      scrollTop < elOffsetTop + elHeight &&
        elOffsetTop < scrollTop + viewportHeight
    ).toBeTruthy();
  }
};
