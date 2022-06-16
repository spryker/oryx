import { fixture, html } from '@open-wc/testing-helpers';
import '@spryker-oryx/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { a11yConfig } from '../../../a11y';
import { queryFirstAssigned } from '../../../utilities';
import { PageNavigationItemComponent } from '../../page-navigation-item';
import './index';

describe('Page navigation item', () => {
  let element: PageNavigationItemComponent;

  describe('when slots are filled', () => {
    const heading = 'Heading';
    const content = 'Subtitle';

    beforeEach(async () => {
      element = await fixture(html` <oryx-page-navigation-item>
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
