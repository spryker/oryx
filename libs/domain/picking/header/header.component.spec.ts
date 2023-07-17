import { fixture } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { SiteNavigationItemComponent } from '@spryker-oryx/site/navigation-item';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import HeaderComponent from './header.component';
import { headerComponent } from './header.def';

describe('Header Component', () => {
  let element: HeaderComponent;

  beforeAll(async () => {
    await useComponent([headerComponent]);
  });

  beforeEach(async () => {
    element = await fixture(`<oryx-header></oryx-header>`);
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(HeaderComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render account button with proper options', () => {
    expect(element).toContainElement('oryx-site-navigation-item');
    expect(
      element.renderRoot.querySelector<SiteNavigationItemComponent>(
        'oryx-site-navigation-item'
      )?.options
    ).toEqual({
      icon: IconTypes.User,
      triggerType: 'icon',
      contentBehavior: 'modal',
      label: i18n('oryx.picking.account'),
    });
  });
});
