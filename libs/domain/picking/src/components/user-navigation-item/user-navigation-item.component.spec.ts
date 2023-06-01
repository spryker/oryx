import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { UserNavigationItemComponent } from './user-navigation-item.component';
import { userNavigationItemComponent } from './user-navigation-item.def';

describe('UserNavigationItemComponent', () => {
  let element: UserNavigationItemComponent;

  beforeAll(async () => {
    await useComponent(userNavigationItemComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-picking-user-navigation-item></oryx-picking-user-navigation-item>`
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(UserNavigationItemComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
