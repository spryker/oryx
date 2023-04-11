import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { Pagination, ProductListPageService } from '@spryker-oryx/product';
import { html } from 'lit';
import { of } from 'rxjs';
import { beforeEach } from 'vitest';
import { NavigationButtonComponent } from './navigation-button.component';
import { navigationButtonComponent } from './navigation-button.def';

describe('NavigationButtonComponent', () => {
  let element: NavigationButtonComponent;

  beforeAll(async () => {
    await useComponent(navigationButtonComponent);
  });

  beforeEach(async () => {
    element = await fixture(html`
      <oryx-site-navigation-button text="test"></oryx-site-navigation-button>
    `);
  });

  afterEach(() => {
    destroyInjector();
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render oryx-heading', () => {
    expect(element).toContainElement('')
  });

  it(`should render ${mockPagination.maxPage} pagination items`, () => {
    expect(
      element.renderRoot.querySelectorAll('oryx-pagination a').length
    ).toBe(mockPagination.maxPage);
  });
});
