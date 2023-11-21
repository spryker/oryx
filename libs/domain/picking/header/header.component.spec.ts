import { fixture } from '@open-wc/testing-helpers';
import { SiteNavigationItemComponent } from '@spryker-oryx/site/navigation-item';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n, useComponent } from '@spryker-oryx/utilities';
import PickingHeaderComponent from './header.component';
import { pickingHeaderComponent } from './header.def';

describe('Picking Header Component', () => {
  let element: PickingHeaderComponent;

  beforeAll(async () => {
    await useComponent([pickingHeaderComponent]);
  });

  beforeEach(async () => {
    element = await fixture(`<oryx-picking-header></oryx-picking-header>`);
  });

  it('is defined', () => {
    expect(element).toBeInstanceOf(PickingHeaderComponent);
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
      label: i18n('picking.account'),
    });
  });
});
