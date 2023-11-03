import { dispatchKeydown } from '@/tools/testing';
import { fixture } from '@open-wc/testing-helpers';
import { a11yConfig } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SpyInstance } from 'vitest';
import { CLOSE_EVENT } from '../popover.model';
import { HighlightController } from './highlight.controller';

/** scrollIntoView is not implemented in jsdom */
Element.prototype.scrollIntoView = vi.fn();

@customElement('fake-popover')
class FakePopoverComponent extends LitElement {
  controller = new HighlightController(this, 'li');

  render(): TemplateResult {
    return html`
      <ul>
        <slot></slot>
      </ul>
    `;
  }
}

describe('HighlightController', () => {
  let element: FakePopoverComponent;

  describe('with items', () => {
    let items: HTMLElement[];

    const expectElementHighLight = (highlight: number): void => {
      items.forEach((item, index) => {
        if (index === highlight)
          expect(item.hasAttribute('highlight')).toBe(true);
        else expect(item.hasAttribute('highlight')).toBe(false);
      });
    };

    beforeEach(async () => {
      element = await fixture(html`<fake-popover>
        ${[...Array(25)].map((_, index) => html`<li>${index + 1}</li>`)}
      </fake-popover>`);

      items = Array.from(element.querySelectorAll('li'));
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    describe('when an item is highlighted', () => {
      beforeEach(() => {
        element.controller.highlight = 5;
      });
      describe('and the highlight is changed', () => {
        beforeEach(() => {
          element.controller.highlight = 10;
        });
        it('should no longer "highlight" the original highlighted item', () => {
          expect(items[5].hasAttribute('highlight')).toBe(false);
        });
        it('should add the "highlight" attribute to the item', () => {
          expect(items[10].hasAttribute('highlight')).toBe(true);
        });
      });
      describe('and the clear method is called', () => {
        beforeEach(() => {
          element.controller.clear();
        });
        it('should clear the selected item', () => {
          expect(element.controller.highlight).toBe(-1);
        });
      });
    });

    describe('when no item is selected', () => {
      beforeEach(() => {
        element.controller.clear();
      });
      describe('and the highlight is set', () => {
        beforeEach(() => {
          element.controller.highlight = 5;
        });
        it('should add the "highlight" attribute to the item', () => {
          expect(items[5].hasAttribute('highlight')).toBe(true);
        });
      });

      describe('and the highlight is moved by the keyboard', () => {
        beforeEach(() => {
          element.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
          );
        });
        it('should move the "highlight" to the next item', () => {
          expect(items[0].hasAttribute('highlight')).toBe(true);
        });
      });
    });

    describe('when the first item is highlighted', () => {
      let highlightedItem: HTMLElement;
      beforeEach(() => {
        items[0].toggleAttribute('highlight', true);
      });

      describe('and the "ArrowUp" key is dispatched', () => {
        beforeEach(() => {
          vi.useFakeTimers();
          highlightedItem = items[24];
          vi.spyOn(highlightedItem, 'scrollIntoView');
          dispatchKeydown(element, 'ArrowUp');
        });

        afterEach(() => {
          vi.clearAllTimers();
        });

        it('should highlight the last item', () => {
          expectElementHighLight(24);
        });

        describe('and 300ms has not passed', () => {
          beforeEach(() => {
            vi.advanceTimersByTime(300 - 1);
          });

          it('should not trigger scrollIntoView when the popup is shown', () => {
            expect(highlightedItem?.scrollIntoView).toHaveBeenCalled();
            expect(highlightedItem?.scrollIntoView).toHaveBeenCalledTimes(1);
          });
        });

        describe('and 300ms has passed', () => {
          beforeEach(() => {
            vi.advanceTimersByTime(300);
          });

          it('should trigger scrollIntoView when the popup is shown', () => {
            expect(highlightedItem?.scrollIntoView).toHaveBeenCalled();
            expect(highlightedItem?.scrollIntoView).toHaveBeenCalledTimes(2);
          });
        });

        describe('and the "ArrowUp" key is dispatch again', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'ArrowUp');
          });

          it('should highlight the second last item', () => {
            expectElementHighLight(23);
          });
        });
      });

      describe('and the "ArrowUp" + meta key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'ArrowUp', true);
        });
        it('should move highlight the highlight to the first item', () => {
          expectElementHighLight(0);
        });

        describe('and the  "ArrowUp" + meta key is dispatched multiple times', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'ArrowUp', true);
            dispatchKeydown(element, 'ArrowUp', true);
          });
          it('should keep the highlight at the first item', () => {
            expectElementHighLight(0);
          });
        });
      });

      describe('and the "ArrowDown" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'ArrowDown');
        });

        it('should highlight the 2nd item', () => {
          expectElementHighLight(1);
        });

        describe('and the "ArrowDown" key is dispatch again', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'ArrowDown');
          });

          it('should highlight the 3rd item', () => {
            expectElementHighLight(2);
          });
        });
      });

      describe('and the "ArrowDown" + meta key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'ArrowDown', true);
        });
        it('should move highlight the highlight to the 10th item', () => {
          expectElementHighLight(10);
        });

        describe('and the keydown+meta key is dispatch again', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'ArrowDown', true);
          });
          it('should move highlight the highlight to the 20th item', () => {
            expectElementHighLight(20);
          });

          describe('and the keydown+meta key is dispatched multiple times', () => {
            beforeEach(() => {
              dispatchKeydown(element, 'ArrowDown', true);
              dispatchKeydown(element, 'ArrowDown', true);
              dispatchKeydown(element, 'ArrowDown', true);
            });
            it('should keep the highlight at the last item', () => {
              expectElementHighLight(24);
            });
          });
        });
      });

      describe('and the "PageUp" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'PageUp');
        });
        it('should keep the highlight at the first item', () => {
          expectElementHighLight(0);
        });

        describe('and the "PageUp" key is dispatch again', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'PageUp');
          });

          it('should keep the highlight at the first item', () => {
            expectElementHighLight(0);
          });
        });
      });

      describe('and the "PageDown" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'PageDown');
        });
        it('should move the highlight the 10th item', () => {
          expectElementHighLight(10);
        });

        describe('and the "PageDown" key is dispatch again', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'PageDown');
          });
          it('should move highlight the highlight to the 20th item', () => {
            expectElementHighLight(20);
          });

          describe('and the "PageDown" is dispatched multiple times', () => {
            beforeEach(() => {
              dispatchKeydown(element, 'PageDown');
              dispatchKeydown(element, 'PageDown');
              dispatchKeydown(element, 'PageDown');
            });
            it('should keep the highlight at the last item', () => {
              expectElementHighLight(24);
            });
          });
        });
      });

      describe('and the "Home" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'Home');
        });
        it('should keep the highlight at the first item', () => {
          expectElementHighLight(0);
        });

        describe('and the "Home" is dispatch multiple times', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'Home');
            dispatchKeydown(element, 'Home');
            dispatchKeydown(element, 'Home');
          });
          it('should keep the highlight at the first item', () => {
            expectElementHighLight(0);
          });
        });
      });

      describe('and the "End" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'End');
        });
        it('should move the highlight to the last item', () => {
          expectElementHighLight(24);
        });

        describe('and the "End" is dispatch multiple times', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'End');
            dispatchKeydown(element, 'End');
            dispatchKeydown(element, 'End');
          });
          it('should keep the highlight at the last item', () => {
            expectElementHighLight(24);
          });
        });
      });

      describe(`and the ${CLOSE_EVENT} is dispatched`, () => {
        beforeEach(() => {
          element.dispatchEvent(
            new CustomEvent(CLOSE_EVENT, { composed: true, bubbles: true })
          );
        });
        it('should not have a highlighted item', () => {
          expectElementHighLight(-1);
        });
      });
    });

    describe('when the last item is highlighted', () => {
      beforeEach(() => {
        items[24].toggleAttribute('highlight', true);
      });

      describe('and the "ArrowUp" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'ArrowUp');
        });

        it('should highlight the second last item', () => {
          expectElementHighLight(23);
        });

        describe('and the "ArrowUp" key is dispatch again', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'ArrowUp');
          });

          it('should move the highlight one up', () => {
            expectElementHighLight(22);
          });
        });
      });

      describe('and the "ArrowUp" + meta key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'ArrowUp', true);
        });
        it('should move highlight the highlight to the first item', () => {
          expectElementHighLight(14);
        });

        describe('and the  "ArrowUp" + meta key is dispatched again', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'ArrowUp', true);
          });
          it('should keep the highlight at the first item', () => {
            expectElementHighLight(4);
          });

          describe('and the  "ArrowUp" + meta key is dispatched multiple times', () => {
            beforeEach(() => {
              dispatchKeydown(element, 'ArrowUp', true);
              dispatchKeydown(element, 'ArrowUp', true);
            });
            it('should keep the highlight at the first item', () => {
              expectElementHighLight(0);
            });
          });
        });
      });

      describe('and the "ArrowDown" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'ArrowDown');
        });

        it('should highlight the 1st item', () => {
          expectElementHighLight(0);
        });

        describe('and the "ArrowDown" key is dispatch again', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'ArrowDown');
          });

          it('should highlight the 2nd item', () => {
            expectElementHighLight(1);
          });
        });
      });

      describe('and the "ArrowDown" + meta key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'ArrowDown', true);
        });
        it('should keep the highlight at the last item', () => {
          expectElementHighLight(24);
        });

        describe('and the keydown+meta key is dispatched multiple times', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'ArrowDown', true);
            dispatchKeydown(element, 'ArrowDown', true);
          });
          it('should keep the highlight at the last item', () => {
            expectElementHighLight(24);
          });
        });
      });

      describe('and the "PageUp" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'PageUp');
        });
        it('should move the highlight at the 14th item', () => {
          expectElementHighLight(14);
        });

        describe('and the "PageUp" key is dispatched again', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'PageUp');
          });

          it('should move the highlight to the 4th item', () => {
            expectElementHighLight(4);
          });

          describe('and the "PageUp" key is dispatched multiple times', () => {
            beforeEach(() => {
              dispatchKeydown(element, 'PageUp');
              dispatchKeydown(element, 'PageUp');
            });

            it('should keep the highlight at the first item', () => {
              expectElementHighLight(0);
            });
          });
        });
      });

      describe('and the "PageDown" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'PageDown');
        });
        it('should keep the highlight the last item', () => {
          expectElementHighLight(24);
        });

        describe('and the "PageDown" key is dispatched multiple times', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'PageDown');
            dispatchKeydown(element, 'PageDown');
          });
          it('should move highlight the highlight to the 20th item', () => {
            expectElementHighLight(24);
          });
        });
      });

      describe('and the "Home" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'Home');
        });
        it('should move the highlight to the first item', () => {
          expectElementHighLight(0);
        });

        describe('and the "Home" is dispatched multiple times', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'Home');
            dispatchKeydown(element, 'Home');
            dispatchKeydown(element, 'Home');
          });
          it('should keep the highlight at the first item', () => {
            expectElementHighLight(0);
          });
        });
      });

      describe('and the "End" key is dispatched', () => {
        beforeEach(() => {
          dispatchKeydown(element, 'End');
        });
        it('should keep the highlight at the last item', () => {
          expectElementHighLight(24);
        });

        describe('and the "End" is dispatched multiple times', () => {
          beforeEach(() => {
            dispatchKeydown(element, 'End');
            dispatchKeydown(element, 'End');
            dispatchKeydown(element, 'End');
          });
          it('should keep the highlight at the last item', () => {
            expectElementHighLight(24);
          });
        });
      });

      describe(`and the ${CLOSE_EVENT} is dispatched`, () => {
        beforeEach(() => {
          element.dispatchEvent(
            new CustomEvent(CLOSE_EVENT, { composed: true, bubbles: true })
          );
        });
        it('should not have a highlighted item', () => {
          expectElementHighLight(-1);
        });
      });
    });
  });

  describe('without items', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-popover></fake-popover>`);
    });

    describe('when the highlight is set for an unknown item', () => {
      beforeEach(() => {
        element.controller.highlight = 5;
      });
      it('should not throw an error', () => {
        if (element) {
          expect(() => {
            (): void => undefined;
          }).not.toThrow();
        }
      });
    });
  });

  describe('when the host is disconnected', () => {
    let closeEventSpy: SpyInstance;

    beforeEach(async () => {
      element = await fixture(html`
        <fake-popover show>
          <oryx-option>first</oryx-option>
          <oryx-option>second</oryx-option>
        </fake-popover>
      `);
      //simulate disconnect hook
      element.controller.hostDisconnected();

      closeEventSpy = vi.spyOn(element.controller, 'clear');

      dispatchKeydown(element, 'ArrowDown');
      element?.dispatchEvent(
        new CustomEvent(CLOSE_EVENT, {
          bubbles: true,
          composed: true,
        })
      );
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should not highlight elements', () => {
      expect(element.querySelector('[highlighted]')).toBe(null);
    });

    it('should not call close event handler', () => {
      expect(closeEventSpy).not.toHaveBeenCalled();
    });
  });
});
