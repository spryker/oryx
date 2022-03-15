import { expect, fixture } from '@open-wc/testing';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import * as sinon from 'sinon';
import { a11yConfig } from '../../../a11y';
import { dispatchKeydown } from '../../../utilities';
import { PopoverComponent } from '../popover.component';
import { ToggleController } from './toggle.controller';

@customElement('fake-popover')
class FakePopoverComponent extends LitElement {
  controller = new ToggleController(this, 'oryx-popover', 'li');
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
  controller = new ToggleController(this, 'oryx-popover', 'li');
  render(): TemplateResult {
    return html` <slot></slot> `;
  }
}

describe('ToggleController', () => {
  let element: FakePopoverComponent | FakeWithoutPopoverComponent;

  const utils = {
    popover: (): PopoverComponent | null => {
      return element.renderRoot.querySelector('oryx-popover');
    },
  };

  describe('with toggle element', () => {
    describe('with small list of items', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-popover>
          <ol>
            <li>1</li>
            <li>1</li>
            <li>1</li>
          </ol>
        </fake-popover>`);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      ['Enter', ' '].forEach((key) => {
        describe(`when the "${key}" key is dispatched`, () => {
          beforeEach(() => {
            dispatchKeydown(element, key);
          });

          it('should show the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).to.be.true;
          });

          describe(`when the "${key}" key is dispatched again`, () => {
            beforeEach(() => {
              dispatchKeydown(element, key);
            });

            it('should hide the popover', () => {
              expect(utils.popover()?.hasAttribute('show')).to.be.false;
            });
          });

          describe('when the "Escape" key is dispatched', () => {
            beforeEach(() => {
              dispatchKeydown(element, 'Escape');
            });

            it('should hide the popover', () => {
              expect(utils.popover()?.hasAttribute('show')).to.be.false;
            });
          });
        });
      });

      'abc%;`'.split('').forEach((key) => {
        describe(`when a random key (${key}) is dispatched`, () => {
          beforeEach(() => {
            dispatchKeydown(element, key);
          });
          it('should show the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).to.be.true;
          });

          describe(`when a random key (${key}) is dispatched again`, () => {
            beforeEach(() => {
              dispatchKeydown(element, key);
            });
            it('should keep the popover open', () => {
              expect(utils.popover()?.hasAttribute('show')).to.be.true;
            });
          });
        });
      });

      describe(`when the meta key is dispatched`, () => {
        beforeEach(() => {
          dispatchKeydown(element, 'Meta', true);
        });
        it('should not show the popover', () => {
          expect(utils.popover()?.hasAttribute('show')).to.be.false;
        });
      });

      describe('when the element is shown', () => {
        beforeEach(async () => {
          element = await fixture(html`<fake-popover show></fake-popover>`);
        });

        describe('and the blur event is dispatched on the window', () => {
          beforeEach(() => {
            window.dispatchEvent(new Event('blur', { bubbles: true }));
          });
          describe('and the focusEvent is dispatched on the element', () => {
            beforeEach(() => {
              element.dispatchEvent(new Event('focusin', { bubbles: true }));
            });
          });

          it('should hide the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).to.be.false;
          });
        });

        describe('and the focusout event is dispatched', () => {
          beforeEach(() => {
            element.dispatchEvent(new Event('focusout', { bubbles: true }));
          });
          it('should hide the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).to.be.false;
          });
        });
      });

      describe('when the element is hidden', () => {
        let clock: sinon.SinonFakeTimers;

        beforeEach(async () => {
          element = await fixture(html`<fake-popover>
            <li>first</li>
            <li selected highlight>second</li>
            <li>third</li>
          </fake-popover>`);
          clock = sinon.useFakeTimers();
        });

        afterEach(() => {
          sinon.restore();
        });

        describe('and the focusin event is dispatched', () => {
          beforeEach(() => {
            element.dispatchEvent(new Event('focusin', { bubbles: true }));
          });
          it('should show the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).to.be.true;
          });
        });

        describe('and the mousedown event is dispatched', () => {
          beforeEach(() => {
            element.dispatchEvent(new Event('mousedown', { bubbles: true }));
          });
          it('should show the popover', () => {
            expect(utils.popover()?.hasAttribute('show')).to.be.true;
          });

          describe('and 300ms has not yet passed', () => {
            describe('and the mouseup event is dispatched', () => {
              beforeEach(() => {
                clock.tick(300 - 1);
                element.dispatchEvent(new Event('mouseup', { bubbles: true }));
              });
              it('should show the popover', () => {
                expect(utils.popover()?.hasAttribute('show')).to.be.true;
              });
            });
          });

          describe('and 300ms has passed', () => {
            describe('and the mouseup event is dispatched', () => {
              beforeEach(() => {
                clock.tick(300 + 1);
                element.dispatchEvent(new Event('mouseup', { bubbles: true }));
              });
              it('should not show the popover', () => {
                expect(utils.popover()?.hasAttribute('show')).to.be.false;
              });
            });
          });
        });
      });
    });

    describe('with long list of items', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-popover>
          ${Array.from(Array(15)).map(() => html`<li>1</li>`)}
        </fake-popover>`);
      });

      describe(`when the "Enter" key is dispatched`, () => {
        beforeEach(() => {
          dispatchKeydown(element, 'Enter');
        });

        it('should show the popover', () => {
          expect(utils.popover()?.hasAttribute('show')).to.be.true;
        });
      });
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
        expect(element.controller.isOpen).to.be.false;
      });
    });

    describe(`when the toggle is not forced`, () => {
      beforeEach(() => {
        element.controller.toggle();
      });
      it('should not throw an error', () => {
        expect(element.controller.isOpen).to.be.false;
      });
    });
  });
});
