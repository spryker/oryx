import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { PopoverComponent } from '@spryker-oryx/ui/popover';
import { a11yConfig, Size } from '@spryker-oryx/utilities';
import { IconButtonComponent } from '../../../../ui/action/icon-button';
import { dropdownComponent } from './component';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let element: DropdownComponent;

  const getPopover = (): PopoverComponent | null => {
    return element.renderRoot.querySelector('oryx-popover');
  };

  const dispatchCloseEvent = (element: HTMLElement | null): void => {
    element?.dispatchEvent(
      new CustomEvent('oryx.close', {
        bubbles: true,
        composed: true,
      })
    );
  };

  beforeAll(async () => {
    await useComponent(dropdownComponent);
  });

  beforeEach(async () => {
    element = await fixture(html`<oryx-dropdown></oryx-dropdown>`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible(a11yConfig);
  });

  describe('when dropdown is closed', () => {
    it('should have "inert" attr on the popover', async () => {
      expect(getPopover()?.hasAttribute('inert')).toBe(true);
    });
  });

  describe('when "open" attr added', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-dropdown open></oryx-dropdown>`);
    });

    it('should show the popover', async () => {
      expect(getPopover()?.hasAttribute('show')).toBe(true);
    });

    it('should remove "inert" attr from the popover', async () => {
      expect(getPopover()?.hasAttribute('inert')).toBe(false);
    });
  });

  describe('when "oryx.close" event dispatched', () => {
    let input: HTMLInputElement | null | undefined;

    beforeEach(async () => {
      element = await fixture(html`<oryx-dropdown>
        <input />
      </oryx-dropdown>`);

      vi.useFakeTimers();

      input = element.querySelector('input');
      input?.focus();
    });

    afterEach(() => {
      vi.clearAllTimers();
    });

    it('should restore focus on trigger', async () => {
      //due to that trigger-button is nested inside other custom element
      //jsdom can't define activeElement correctly, thats why
      //it's enough to check that input inside popover lost the focus
      //and it passed to the component
      vi.advanceTimersByTime(0);

      expect(input?.matches(':focus')).toBe(true);

      dispatchCloseEvent(getPopover());

      expect(input?.matches(':focus')).toBe(false);
      expect(element?.matches(':focus')).toBe(true);
    });
  });

  [Size.Lg, Size.Md, Size.Sm].forEach((size) => {
    describe(`when the triggerIconSize is '${size}'`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-dropdown open .triggerIconSize=${size}></oryx-dropdown>`
        );
      });

      it('should project the triggerIconSize to the icon button', () => {
        const el = element.shadowRoot?.querySelector(
          'oryx-icon-button'
        ) as IconButtonComponent;

        expect(el.size).toBe(size);
      });
    });
  });
});
