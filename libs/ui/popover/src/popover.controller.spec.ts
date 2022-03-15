import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import * as sinon from 'sinon';
import { PopoverComponent, PopoverController } from '.';
import { a11yConfig } from '../../a11y';
import { getControl } from '../../input';
import '../../option';
import { OptionComponent } from '../../option';

@customElement('fake-popover')
class FakeComponent extends LitElement {
  controller = new PopoverController(this);
  render(): TemplateResult {
    return html`
      <oryx-popover>
        <slot></slot>
      </oryx-popover>
    `;
  }
}
@customElement('fake-without-focus')
class FakeWithoutFocusComponent extends LitElement {
  controller = new PopoverController(this, { showOnFocus: false });
  render(): TemplateResult {
    return html`
      <oryx-popover>
        <slot></slot>
      </oryx-popover>
    `;
  }
}

export class NoPopoverComponent extends FakeComponent {
  render(): TemplateResult {
    return html`no popover`;
  }
}
customElements.define('no-popover', NoPopoverComponent);

describe('PopoverController', () => {
  let element: FakeComponent | FakeWithoutFocusComponent;

  const popover = (): PopoverComponent | null => {
    return element.renderRoot.querySelector('oryx-popover');
  };

  describe('handleKeydown', () => {
    describe('when the popover is open', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-popover show>
          <input placeholder="a11y" />
          ${[...Array(25)].map(
            (_, index) => html`<oryx-option>${index + 1}</oryx-option>`
          )}
        </fake-popover>`);
      });

      beforeEach(() => {
        popover()?.toggleAttribute('show', true);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      describe('and an element is highlighted', () => {
        let highlightedItem: HTMLElement;

        beforeEach(() => {
          highlightedItem =
            element.querySelectorAll<HTMLElement>('oryx-option')?.[5];
          highlightedItem?.toggleAttribute('highlight', true);
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        describe('and the "Enter" key is dispatched', () => {
          beforeEach(() => {
            element.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
            );
          });

          it('should select the highlighted element', () => {
            expect(highlightedItem.hasAttribute('selected')).to.be.true;
          });
        });

        describe('and the " " key is dispatched', () => {
          let expectation: sinon.SinonExpectation;

          describe('and the control is readonly', () => {
            beforeEach(() => {
              getControl(element)?.toggleAttribute('readonly', true);
            });

            beforeEach(() => {
              const event = new KeyboardEvent('keydown', {
                key: ' ',
                bubbles: true,
              });
              expectation = sinon.mock(event).expects('preventDefault').once();
              element.dispatchEvent(event);
            });

            it('should select the highlighted element', () => {
              expect(highlightedItem.hasAttribute('selected')).to.be.true;
              expectation.verify();
            });
          });

          describe('and the control is not readonly', () => {
            beforeEach(() => {
              getControl(element)?.toggleAttribute('readonly', false);
            });

            describe('and the " " key is dispatched', () => {
              let expectation: sinon.SinonExpectation;

              beforeEach(() => {
                const event = new KeyboardEvent('keydown', {
                  key: ' ',
                  bubbles: true,
                });
                expectation = sinon
                  .mock(event)
                  .expects('preventDefault')
                  .never();
                element.dispatchEvent(event);
              });

              it('should not select the highlighted element', () => {
                expect(highlightedItem.hasAttribute('selected')).to.be.false;
                expectation.verify();
              });
            });
          });
        });
      });
    });
  });

  describe('handleInput', () => {
    describe('when the input event is dispatched', () => {
      let input: HTMLInputElement | null;
      beforeEach(async () => {
        element = await fixture(html`<fake-popover>
          <input value="value" />
        </fake-popover>`);
      });

      beforeEach(() => {
        input = element.querySelector('input');
        input?.dispatchEvent(new InputEvent('input', { bubbles: true }));
      });

      it('should show the popover', () => {
        expect(
          element.renderRoot.querySelector('oryx-popover')?.hasAttribute('show')
        ).to.be.true;
      });
    });
  });

  describe('handleChange', () => {
    const expectChangeEvent = (): void => {
      it('should not throw an error', () => {
        popover()?.dispatchEvent(
          new Event('change', { bubbles: true, composed: true })
        );
        expect(() => {
          (): void => undefined;
        }).not.to.throw;
      });
    };

    describe('when a change event is dispatched', () => {
      describe('with items', () => {
        beforeEach(async () => {
          element = await fixture(html`<fake-popover>
            <input value="first" />
            <oryx-option value="first">first</oryx-option>
            <oryx-option>second</oryx-option>
          </fake-popover>`);
        });
        expectChangeEvent();
      });

      describe('without items', () => {
        beforeEach(async () => {
          element = await fixture(html`<fake-popover>
            <input value="value" />
          </fake-popover>`);
        });

        expectChangeEvent();
      });
    });
  });

  describe('with popover', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-popover>
        ${[...Array(25)].map(
          (_, index) => html`<oryx-option>${index + 1}</oryx-option>`
        )}
      </fake-popover>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    describe('scrollIntoView', () => {
      let clock: sinon.SinonFakeTimers;
      let option: OptionComponent | null;

      beforeEach(() => {
        clock = sinon.useFakeTimers();
      });

      afterEach(() => {
        clock.restore();
      });

      beforeEach(async () => {
        element = await fixture(html`<fake-popover>
          <oryx-option>first</oryx-option>
          <oryx-option selected highlight>second</oryx-option>
        </fake-popover>`);
        option = element.querySelector('oryx-option[selected]');
      });

      describe('when an item is selected', () => {
        beforeEach(async () => {
          if (option) {
            sinon.spy(option, 'scrollIntoView');
          }
          element.dispatchEvent(
            new Event('input', { bubbles: true, composed: true })
          );
        });

        it('should not trigger scrollIntoView when the popup is shown', () => {
          expect(option?.scrollIntoView).to.have.not.been.called;
        });
      });
    });
  });

  describe('when the focus is not required', () => {
    beforeEach(async () => {
      element = await fixture(html`<fake-without-focus></fake-without-focus>`);
    });
    it('should not throw an error', () => {
      popover()?.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      );
      expect(() => {
        (): void => undefined;
      }).not.to.throw;
    });
  });
});
