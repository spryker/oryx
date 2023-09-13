import { fixture } from '@open-wc/testing-helpers';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { useComponent } from '@spryker-oryx/utilities';
import { html } from 'lit';
import { DropdownItemComponent } from './dropdown-item.component';
import { dropdownItemComponent } from './dropdown-item.def';

describe('DropdownItemComponent', () => {
  let element: DropdownItemComponent;

  beforeAll(async () => {
    await useComponent(dropdownItemComponent);
  });

  beforeEach(async () => {
    element = await fixture(
      html`<oryx-site-dropdown-item></oryx-site-dropdown-item>`
    );
  });

  it('should be defined', () => {
    expect(element).toBeInstanceOf(DropdownItemComponent);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('should render components', () => {
    expect(element.renderRoot.querySelector('oryx-button')).not.toBeNull();
  });

  describe('when dropdown has content', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-dropdown-item
          .content=${{ text: 'mock' }}
        ></oryx-site-dropdown-item>`
      );
    });

    it('should render text', () => {
      expect(element).toContainElement('span');
      expect(element.renderRoot.querySelector('span')?.innerText).toBe('mock');
    });
  });

  describe('when dropdown has a url', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-dropdown-item
          .options=${{ url: 'mock' }}
        ></oryx-site-dropdown-item>`
      );
    });

    it('should render anchor link', () => {
      expect(element).toContainElement('a[href]');
      expect(
        (element.renderRoot.querySelector('a[href]') as HTMLAnchorElement).href
      ).toContain('mock');
    });
  });

  describe('when dropdown has an icon', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-site-dropdown-item
          .options=${{ icon: IconTypes.Add }}
        ></oryx-site-dropdown-item>`
      );
    });
    it('should render icon', () => {
      expect(element).toContainElement('oryx-icon');
      expect(
        element.renderRoot.querySelector('oryx-icon')?.getAttribute('type')
      ).toBe(IconTypes.Add);
    });
  });
});
