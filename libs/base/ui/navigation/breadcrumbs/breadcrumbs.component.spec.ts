import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { breadcrumbsComponent } from './breadcrumbs.def';

describe('BreadcrumbsComponent', () => {
  let element: BreadcrumbsComponent;

  beforeAll(async () => await useComponent([breadcrumbsComponent]));

  describe('when breadcrumbs specified', () => {
    let slot: HTMLSlotElement;

    beforeEach(async () => {
      element = await fixture(html`
        <oryx-breadcrumbs>
          <a href="/">1</a>
          <oryx-icon></oryx-icon>
          <a href="/">1</a>
          <oryx-icon></oryx-icon>
          <a href="/">1</a>
        </oryx-breadcrumbs>
      `);

      slot = element.renderRoot.querySelector<HTMLSlotElement>('slot')!;
    });

    it('should pass the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should render slot', () => {
      expect(slot).toBeDefined();
    });

    it('should render all slotted elements', () => {
      expect(slot.assignedElements().length).toBe(5);
    });
  });
});
