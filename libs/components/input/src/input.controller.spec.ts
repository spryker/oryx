import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { InputController } from './input.controller';

export class TestComponent extends LitElement {
  protected inputController = new InputController(this);

  render(): TemplateResult {
    return this.inputController.render();
  }

  get control(): HTMLInputElement | null {
    return this.inputController.control;
  }
}

customElements.define('test-control', TestComponent);

export class NoSlotComponent extends LitElement {
  protected inputController = new InputController(this);

  render(): TemplateResult {
    return html``;
  }

  get control(): HTMLInputElement | null {
    return this.inputController.control;
  }
}
customElements.define('no-slot', NoSlotComponent);

describe('InputController', () => {
  let element: TestComponent;

  describe('control', () => {
    describe('when no light dom is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<test-control />`);
      });

      it('should render shadow dom', () => {
        expect(element.control).to.eq(
          element.shadowRoot?.querySelector('input')
        );
      });
    });

    describe('when a text node is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<test-control> </test-control>`);
      });
      it('is should not render shadow dom', () => {
        expect(element.control).to.be.undefined;
      });

      describe('when light dom is slotted in', () => {
        beforeEach(async () => {
          element = await fixture(html`<test-control>
            <input id="light" />
          </test-control>`);
        });
        it('is should render light dom', () => {
          expect(element.control).to.eq(element.querySelector('input#light'));
        });
      });

      describe('when invalid control is provided', () => {
        beforeEach(async () => {
          element = await fixture(html`<test-control>
            <span slot="control">this won't work</span>
          </test-control>`);
        });
        it('should not have a control', () => {
          expect(element.control).to.be.undefined;
        });
      });
    });

    describe('click', () => {
      beforeEach(async () => {
        element = await fixture(html`<test-control>
          <input id="light" />
          <button id="focusable">focusable</button>
          <span id="notFocusable">not focusable</span>
        </test-control>`);
      });

      describe('when a non-focusable element is clicked', () => {
        beforeEach(async () => {
          element
            .querySelector('#notFocusable')
            ?.dispatchEvent(new Event('click', { bubbles: true }));
        });
        it('should focus the control', () => {
          expect(document.activeElement).to.eq(element.control);
        });
      });

      describe('when a focusable element is clicked', () => {
        beforeEach(async () => {
          element
            .querySelector('#focusable')
            ?.dispatchEvent(new Event('click', { bubbles: true }));
        });
        it('should not focus the control', () => {
          expect(document.activeElement).to.not.eq(element.control);
        });
      });
    });

    describe('disabled', () => {
      describe('when an input is not disabled', () => {
        beforeEach(async () => {
          element = await fixture(html`<test-control><input /></test-control>`);
        });
        it('should not set the disabled property', () => {
          expect(element.hasAttribute('disabled')).to.be.false;
        });

        describe('but when it is disabled afterwards', () => {
          beforeEach(async () => {
            element.querySelector('input')?.setAttribute('disabled', 'true');
          });
          it('should set the disabled property to true', () => {
            expect(element.hasAttribute('disabled')).to.be.true;
          });
        });
      });

      describe('when an input is disabled', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<test-control>
              <input disabled />
            </test-control>`
          );
        });
        it('should reflect the disabled attribute on the host element', () => {
          expect(element?.getAttribute('disabled')).to.exist;
        });
      });

      describe('when slot content is changed', () => {
        beforeEach(async () => {
          element = await fixture(html`<test-control><input /></test-control>`);
          (
            element.shadowRoot?.querySelector(
              'slot:not([name])'
            ) as HTMLSlotElement
          ).dispatchEvent(new Event('slotchange'));
        });
        it('should not set the disabled property', () => {
          expect(element?.hasAttribute('disabled')).to.be.false;
        });
      });
    });

    describe('when no slot is available', () => {
      beforeEach(async () => {
        element = await fixture(html`<no-slot />`);
      });

      it('should not render a control', () => {
        expect(element.control).to.be.undefined;
      });
    });
  });
});
