import { fixture } from '@open-wc/testing-helpers';
import { ContextService } from '@spryker-oryx/core';
import { createInjector, destroyInjector } from '@spryker-oryx/di';
import { AccountMenuLinks } from '@spryker-oryx/user';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { of } from 'rxjs';
import { AccountMenuComponent } from './account-menu.component';
import { accountMenuComponent } from './account-menu.def';

class MockContextService implements Partial<ContextService> {
  get = vi.fn();
}

describe('AccountMenuComponent', () => {
  let element: AccountMenuComponent;
  let context: MockContextService;

  beforeAll(async () => {
    await useComponent(accountMenuComponent);
  });

  beforeEach(async () => {
    const testInjector = createInjector({
      providers: [
        {
          provide: ContextService,
          useClass: MockContextService,
        },
      ],
    });

    context = testInjector.inject(
      ContextService
    ) as unknown as MockContextService;

    element = await fixture(
      html`<oryx-user-account-menu></oryx-user-account-menu>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    destroyInjector();
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(AccountMenuComponent);
  });

  it('should pass the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render its components', () => {
    expect(element.renderRoot.querySelectorAll('oryx-button').length).toBe(4);
  });

  describe('when account tab is valid', () => {
    beforeEach(async () => {
      context.get.mockReturnValue(of(AccountMenuLinks.OVERVIEW));

      element = await fixture(
        html`<oryx-user-account-menu></oryx-user-account-menu>`
      );
    });

    it('should highlight selected tab', () => {
      expect(element.renderRoot.querySelector('.active')).not.toBeNull();
    });
  });
});
