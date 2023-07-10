import { dispatchKeydown, userAgentSafariMacOsX154 } from '@/tools/testing';
import { fixture } from '@open-wc/testing-helpers';
import { a11yConfig } from '@spryker-oryx/utilities';
import { clear, mockUserAgent } from 'jest-useragent-mock';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PopoverComponent } from '../popover.component';
import { CLOSE_EVENT } from '../popover.model';
import { ToggleController } from './toggle.controller';

/** scrollIntoView is not implemented in jsdom */
Element.prototype.scrollIntoView = vi.fn();

@customElement('fake-popover')
class FakePopoverComponent extends LitElement {
  controller = new ToggleController(this, {
    elementSelector: 'oryx-popover',
    itemSelector: 'li',
    showOnFocus: true,
  });
  render(): TemplateResult {
    return html`
      <oryx-popover>
        <slot></slot>
      </oryx-popover>
    `;
  }
}

@customElement('fake-without-popover')
class FakeWithoutPopoverComponent extends LitElement {
  controller = new ToggleController(this, {
    elementSelector: 'oryx-popover',
    itemSelector: 'li',
  });
  render(): TemplateResult {
    return html` <slot><input /></slot> `;
  }
}
@customElement('fake-popover-not-open-on-focus')
class FakePopoverFocusEventsComponent extends LitElement {
  controller = new ToggleController(this, {
    elementSelector: 'oryx-popover',
    itemSelector: 'li',
  });
  render(): TemplateResult {
    return html`
      <oryx-popover>
        <slot></slot>
      </oryx-popover>
    `;
  }
}

describe('ToggleController', () => {
  let element:
    | FakePopoverComponent
    | FakeWithoutPopoverComponent
    | FakePopoverFocusEventsComponent;
  let outerButton: HTMLButtonElement;

  const utils = {
    popover: (): PopoverComponent | null => {
      return element.renderRoot.querySelector('oryx-popover');
    },
  };

  beforeAll(() => {
    outerButton = document.createElement('button');
    document.body.append(outerButton);
  });

  describe('when "open" attr set by default', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-popover open>
        <input placeholder="make a11y happy" />
      </fake-popover>`);
    });

    it(`should set dimensions css variables`, () => {
      expect(
        element.style.getPropertyValue('--_bounding-element-height')
      ).toBeDefined();
      expect(
        element.style.getPropertyValue('--_bounding-element-width')
      ).toBeDefined();
      expect(
        element.style.getPropertyValue('--_bounding-element-height')
      ).toBeDefined();
      expect(
        element.style.getPropertyValue('--_bounding-element-width')
      ).toBeDefined();
    });
  });

  describe('with toggle element', () => {
    describe('with small list of items', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-popover>
          <input placeholder="make a11y happy" />
          <ol>
            <li>1</li>
            <li>1</li>
            <li>1</li>
          </ol>
        </fake-popover>`);
      });

      it('should pass the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      ['Enter', ' '].forEach((key) => {
        describe(`when the "${key}" key is dispatched`, () => {
          it(`should toggle visibility of the popover`, () => {
            dispatchKeydown(element, key);
            expect(utils.popover()?.hasAttribute('show')).toBe(true);
            element.dispatchEvent(new KeyboardEvent('keyup'));

            dispatchKeydown(element, key);
            expect(utils.popover()?.hasAttribute('show')).toBe(false);
          });
        });
      });

      'abc%;`'.split('').forEach((key) => {
        describe(`when a random key (${key}) is dispatched`, () => {
          beforeEach(() => {
            dispatchKeydown(element, key);
          });
          it('should show the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).toBe(true);
          });

          describe(`when a random key (${key}) is dispatched again`, () => {
            beforeEach(() => {
              dispatchKeydown(element, key);
            });
            it('should keep the popover open', () => {
              expect(utils.popover()?.hasAttribute('show')).toBe(true);
            });
          });
        });
      });

      describe(`when the meta key is dispatched`, () => {
        beforeEach(() => {
          dispatchKeydown(element, 'Meta', true);
        });
        it('should not show the popover', () => {
          expect(utils.popover()?.hasAttribute('show')).toBe(false);
        });
      });

      describe(`when Tab key is dispatched`, () => {
        beforeEach(() => {
          dispatchKeydown(element, 'Tab');
        });
        it('should not show the popover', () => {
          expect(utils.popover()?.hasAttribute('show')).toBe(false);
        });
      });

      describe('when the element is shown', () => {
        let input: Element | null;
        let button: HTMLButtonElement | null;
        let nonFocusable: HTMLElement | null;
        const callback = vi.fn();

        beforeEach(async () => {
          element = await fixture(html` <fake-popover @oryx.close=${callback}>
            <span>non-focusable</span>
            <input />
            <button close-popover>close</button>
          </fake-popover>`);
          vi.useFakeTimers();
          input = element.getElementsByTagName('input')[0];
          button = element.querySelector('button');
          nonFocusable = element.querySelector('span');
          (input as HTMLInputElement).focus();
        });

        afterEach(() => {
          vi.clearAllTimers();
        });

        it('should have "show" attr on popover', () => {
          expect(utils.popover()?.hasAttribute('show')).toBe(true);
        });

        describe('and trying to open popover again', () => {
          beforeEach(() => {
            element.controller.toggle(true);
          });

          it('should not hide the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).toBe(true);
          });
        });

        describe('and the focus changes', () => {
          beforeEach(() => {
            outerButton?.focus();

            vi.advanceTimersByTime(0);
          });

          it('should hide the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).toBe(false);
          });

          it('should not have open attr', () => {
            expect(element.hasAttribute('open')).toBe(false);
          });

          it('should dispatch close event', () => {
            expect(callback).toHaveBeenCalled();
          });
        });

        describe('mousedown inside popover', () => {
          beforeEach(() => {
            element.dispatchEvent(new MouseEvent('mousedown'));
            vi.advanceTimersByTime(301);
            element.dispatchEvent(new MouseEvent('mouseup'));
            //delay close-popover attr presence check
            vi.advanceTimersByTime(1);
          });

          it('should not hide the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).toBe(false);
          });
        });

        describe('and clicked on child element', () => {
          describe('that is not focusable', () => {
            let event: MouseEvent;

            beforeEach(() => {
              event = new MouseEvent('mousedown', {
                bubbles: true,
              });
            });

            it('should prevent the default event from bubbling', () => {
              const expectation = vi.spyOn(event, 'preventDefault');
              nonFocusable?.dispatchEvent(event);
              expect(expectation).toHaveBeenCalled();
            });

            it('should stop the propagation of the event', () => {
              const expectation = vi.spyOn(event, 'stopPropagation');
              nonFocusable?.dispatchEvent(event);
              expect(expectation).toHaveBeenCalled();
            });
          });

          describe('that is focusable', () => {
            describe('and has no "close-popover" attr', () => {
              beforeEach(() => {
                input?.dispatchEvent(new MouseEvent('mouseup'));
              });

              it('should not hide the popover', () => {
                expect(utils.popover()?.hasAttribute('show')).toBe(true);
              });
            });

            describe('and has "close-popover" attr', () => {
              beforeEach(() => {
                button?.dispatchEvent(new MouseEvent('mouseup'));
              });

              it('should not hide the popover', () => {
                expect(utils.popover()?.hasAttribute('show')).toBe(true);
              });
            });
          });
        });

        describe('and "Escape" key pressed', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'Escape');
          });

          it('should hide the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).toBe(false);
          });
        });

        describe(`and ${CLOSE_EVENT} dispatched by content`, () => {
          beforeEach(() => {
            input?.dispatchEvent(
              new CustomEvent(CLOSE_EVENT, { bubbles: true, composed: true })
            );

            vi.advanceTimersByTime(0);
          });

          it('should hide the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).toBe(false);
          });
        });

        describe('and window is blurred', () => {
          beforeEach(() => {
            window.dispatchEvent(new Event('blur', { bubbles: true }));
          });

          it('should hide the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).toBe(false);
          });
        });
      });
    });

    describe('when the element is hidden', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-popover>
          <input />
          <li>first</li>
          <li selected highlight>second</li>
          <li>third</li>
        </fake-popover>`);
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.clearAllTimers();
      });

      it('should not have open attr', () => {
        expect(element.hasAttribute('open')).toBe(false);
      });

      describe('and the focusin event is dispatched', () => {
        beforeEach(() => {
          element.dispatchEvent(new Event('focusin', { bubbles: true }));
        });

        it('should show the popover', () => {
          expect(utils.popover()?.hasAttribute('show')).toBe(true);
        });

        it('should have open attr', () => {
          expect(element.hasAttribute('open')).toBe(true);
        });
      });

      describe('and the mousedown event is dispatched', () => {
        beforeEach(() => {
          element.dispatchEvent(new Event('mousedown', { bubbles: true }));
        });

        it('should show the popover', () => {
          expect(utils.popover()?.hasAttribute('show')).toBe(true);
        });

        describe('and 300ms has not yet passed', () => {
          describe('and the mouseup event is dispatched', () => {
            beforeEach(() => {
              vi.advanceTimersByTime(300 - 1);
              element.dispatchEvent(new Event('mouseup', { bubbles: true }));
            });
            it('should show the popover', () => {
              expect(utils.popover()?.hasAttribute('show')).toBe(true);
            });
          });
        });

        describe('and 300ms has passed', () => {
          describe('and the mouseup event is dispatched', () => {
            beforeEach(() => {
              vi.advanceTimersByTime(300 + 1);
              element.dispatchEvent(new Event('mouseup', { bubbles: true }));
              //delay close-popover attr presence check
              vi.advanceTimersByTime(1);
            });
            it('should not show the popover', () => {
              expect(utils.popover()?.hasAttribute('show')).toBe(false);
            });
          });
        });
      });
    });

    describe('and window is blurred', () => {
      const callback = vi.fn();

      beforeEach(async () => {
        element = await fixture(html`<fake-popover @oryx.close=${callback}>
          <input />
          <li>first</li>
          <li selected highlight>second</li>
          <li>third</li>
        </fake-popover>`);

        window.dispatchEvent(new Event('blur', { bubbles: true }));

        element.dispatchEvent(new Event('focusin', { bubbles: true }));
      });

      it('should not show the popover on next focusin', () => {
        expect(utils.popover()?.hasAttribute('show')).toBe(false);
      });

      it('should not call the close callback', () => {
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('with long list of items', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-popover>
        <input />
        ${Array.from(Array(15)).map(() => html`<li>1</li>`)}
      </fake-popover>`);
    });

    describe(`when the "Enter" key is dispatched`, () => {
      beforeEach(() => {
        dispatchKeydown(element, 'Enter');
      });

      it('should show the popover', () => {
        expect(utils.popover()?.hasAttribute('show')).toBe(true);
      });
    });
  });

  describe('when showOnFocus options is false', () => {
    beforeEach(async () => {
      element = await fixture(html` <fake-popover-not-open-on-focus>
        <input />
      </fake-popover-not-open-on-focus>`);
    });

    it('should not show the popover', () => {
      element.dispatchEvent(new Event('focusin', { bubbles: true }));

      expect(utils.popover()?.hasAttribute('show')).toBe(false);
    });
  });

  describe('without toggle element', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<fake-without-popover show></fake-without-popover>`
      );
    });

    describe(`when the toggle is forced to true`, () => {
      beforeEach(() => {
        element.controller.toggle(true);
      });
      it('should not throw an error', () => {
        expect(element.controller.isOpen).toBe(false);
      });
    });

    describe(`when the toggle is not forced`, () => {
      beforeEach(() => {
        element.controller.toggle();
      });
      it('should not throw an error', () => {
        expect(element.controller.isOpen).toBe(false);
      });
    });
  });

  describe('when the host is disconnected', () => {
    beforeEach(async () => {
      element = await fixture(html`
        <fake-popover>
          <input placeholder="make a11y happy" />
          <button>custom close</button>
        </fake-popover>
      `);
      //simulate disconnect hook
      element.controller.hostDisconnected();
    });

    describe('focusin/focusout events', () => {
      it('should not toggle opened state', () => {
        element.dispatchEvent(new Event('focusin'));
        expect(element.controller.isOpen).toBe(false);

        element.dispatchEvent(new Event('focusout'));
        expect(element.controller.isOpen).toBe(false);
      });
    });

    describe('mousedown/mouseup events', () => {
      it('should not toggle opened state', () => {
        element.dispatchEvent(new MouseEvent('mousedown'));
        expect(element.controller.isOpen).toBe(false);

        element.dispatchEvent(new MouseEvent('mouseup'));
        expect(element.controller.isOpen).toBe(false);
      });
    });

    describe('keydown event', () => {
      it('should not toggle opened state', () => {
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(element.controller.isOpen).toBe(false);
      });
    });

    describe('keyup event', () => {
      it('should not toggle opened state', () => {
        element.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        expect(element.controller.isOpen).toBe(false);
      });
    });

    describe(`${CLOSE_EVENT} event`, () => {
      it('should not toggle opened state', async () => {
        element.controller.toggle();

        element.requestUpdate();
        await element.updateComplete;

        element
          .querySelector('button')
          ?.dispatchEvent(new CustomEvent(CLOSE_EVENT));
        expect(element.controller.isOpen).toBe(true);
      });
    });

    describe('global click event', () => {
      it('should not toggle opened state', async () => {
        element.controller.toggle();

        element.requestUpdate();
        await element.updateComplete;

        document.body.click();
        expect(element.controller.isOpen).toBe(true);
      });
    });
  });

  describe('Safari focus on click behavior', () => {
    let button: HTMLButtonElement | null;
    let input: HTMLInputElement | null;

    beforeEach(async () => {
      mockUserAgent(userAgentSafariMacOsX154);

      element = await fixture(
        html`<fake-popover>
          <input />
          <button @mousedown=${(e: MouseEvent): void => e.preventDefault()}>
            safari button
          </button>
        </fake-popover>`
      );
      vi.useFakeTimers();

      button = element.querySelector('button');
      input = element.querySelector('input');
    });

    afterEach(() => {
      clear();
      vi.clearAllTimers();
    });

    it('should mock the safari userAgent', () => {
      expect(navigator.userAgent).toEqual(userAgentSafariMacOsX154);
    });

    describe('when focus changes inside popover', () => {
      beforeEach(() => {
        (input as HTMLInputElement).focus();
      });

      it('should not hide the popover', () => {
        button?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        input?.dispatchEvent(new Event('focusout', { bubbles: true }));

        vi.advanceTimersByTime(0);

        expect(utils.popover()?.hasAttribute('show')).toBe(true);
      });
    });

    describe('when click on the focusable element inside popover', () => {
      it('should focus the broken focusable element', () => {
        button?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        button?.dispatchEvent(new Event('mouseup', { bubbles: true }));

        //delay close-popover attr presence check
        vi.advanceTimersByTime(1);

        expect(button?.matches(':focus')).toBe(true);
      });

      it('should not manually focus the non-broken focusable element', () => {
        input?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        input?.dispatchEvent(new Event('mouseup', { bubbles: true }));

        vi.advanceTimersByTime(0);

        expect(input?.matches(':focus')).toBe(false);
      });
    });
  });
});
