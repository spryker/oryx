import { expect, fixture, html } from '@open-wc/testing';
import { ErrorMessageComponent } from '../../error-message/src/error-message.component';
import './index';
import { TextControlComponent } from './text-control.component';

describe('TextControl', () => {
  let element: TextControlComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-text-control');
    expect(el).to.be.instanceof(TextControlComponent);
  });

  describe('disabled', () => {
    describe('when an input is not disabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control>
            <input></input>
          </oryx-text-control>`
        );
      });
      it('should not set the disabled property', () => {
        expect(element?.disabled).not.to.true;
      });

      describe('but when it is disabled afterwards', () => {
        beforeEach(async () => {
          element.querySelector('input')?.setAttribute('disabled', 'true');
        });
        it('should set the disabled property to true', () => {
          expect(element?.disabled).to.true;
        });
      });
    });
    describe('when an input is disabled', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control>
            <input disabled></input>
          </oryx-text-control>`
        );
      });
      it('should reflect the disabled attribute on the host element', () => {
        expect(element?.getAttribute('disabled')).to.exist;
      });
    });
  });

  describe('label', () => {
    describe('when a label is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control label="label content"></oryx-text-control>`
        );
      });
      it('should render a label element', () => {
        const label = element.shadowRoot?.querySelector('label');
        expect(label?.innerText).to.equal('LABEL CONTENT');
      });
    });

    describe('when a label is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text-control></oryx-text-control>`);
      });
      it('should not render a label element', () => {
        const label = element.shadowRoot?.querySelector('label');
        expect(label).not.to.exist;
      });
    });
  });

  describe('error', () => {
    describe('when an error message is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control error="error message"></oryx-text-control>`
        );
      });

      it('should pass the message to the errorMessage component', () => {
        const errorMessage = element?.shadowRoot?.querySelector(
          'oryx-error-message'
        ) as ErrorMessageComponent;
        expect(errorMessage?.message).to.equal('error message');
      });

      it('should set the hasError property to true', () => {
        expect(element.hasError).to.true;
      });

      it('should have a showError attribute', () => {
        expect(element.getAttribute('showError')).to.exist;
      });
    });

    describe('when an error message is provided', () => {
      describe('and the showError property is set to false', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-text-control
              error="error message"
              .showError=${false}
            ></oryx-text-control>`
          );
        });

        it('should pass the message to the errorMessage component', () => {
          const errorMessage = element?.shadowRoot?.querySelector(
            'oryx-error-message'
          ) as ErrorMessageComponent;
          expect(errorMessage?.message).to.equal('error message');
        });

        it('should set the hasError property to true', () => {
          expect(element.hasError).to.true;
        });

        it('should not have a showError attribute', () => {
          expect(element.getAttribute('showError')).to.not.exist;
        });
      });
    });

    describe('when no error message is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text-control></oryx-text-control>`);
      });

      it('should not have an errorMessage element', () => {
        const errorMessage = element.shadowRoot?.querySelector(
          'oryx-error-message'
        ) as ErrorMessageComponent;
        expect(errorMessage).not.to.exist;
      });

      it('should set the hasError property to undefined', () => {
        expect(element.hasError).to.undefined;
      });

      it('should not have a showError attribute', () => {
        expect(element.getAttribute('showError')).to.not.exist;
      });
    });

    describe('when no error message is provided', () => {
      describe('and the showError attribute is set to true', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-text-control .showError=${true}></oryx-text-control>`
          );
        });

        it('should not have an errorMessage element', () => {
          const errorMessage = element?.shadowRoot?.querySelector(
            'oryx-error-message'
          ) as ErrorMessageComponent;
          expect(errorMessage).to.not.exist;
        });

        it('should have an undefined hasError property', () => {
          expect(element.hasError).to.undefined;
        });

        it('should have a showError attribute', () => {
          expect(element.getAttribute('showError')).to.exist;
        });
      });
    });

    describe('when error content is slotted in', () => {
      describe('and the showError attribute is not explicitly set', () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-text-control>
            <div slot="error">error</div>
          </oryx-text-control>`);
        });

        it('should set hasError property to true', () => {
          expect(element.hasError).to.true;
        });

        it('should have a showError attribute', () => {
          expect(element.getAttribute('showError')).to.exist;
        });
      });

      describe('and the showError attribute is set explicitly to false', () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-text-control .showError=${false}>
            <div slot="error">error</div>
          </oryx-text-control>`);
        });

        it('should not set the showError attribute', () => {
          expect(element.showError).to.be.false;
        });
      });
    });
  });

  describe('prefix', () => {
    describe('when a prefixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control prefixIcon="search"></oryx-text-control>`
        );
      });
      it('should render the icon in the prefix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=prefix] > oryx-icon[type=search]'
          )
        ).to.exist;
      });
    });

    describe('when prefixFill is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control .prefixFill=${true}></oryx-text-control>`
        );
      });
      it('should reflect the attribute on the host element', () => {
        expect(element.prefixFill).to.true;
      });
    });

    describe('when a prefixFill is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text-control></oryx-text-control>`);
      });
      it('should not have the attribute on the host element', () => {
        expect(element.prefixFill).not.to.exist;
      });
    });

    describe('when prefix content is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control>
            <p slot="prefix">prefix content</p>
          </oryx-text-control>`
        );
      });
      it('should have .has-prefix-content class', () => {
        expect(element.classList.contains('has-prefix-content')).to.be.true;
      });
    });
    describe('when no prefix content is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text-control> </oryx-text-control>`);
      });
      it('should not have .has-prefix-content class', () => {
        expect(element.classList.contains('has-prefix-content')).to.be.false;
      });
    });
  });

  describe('suffix', () => {
    describe('when a suffixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control suffixIcon="search"></oryx-text-control>`
        );
      });
      it('should render the icon in the suffix slot', () => {
        expect(
          element.shadowRoot?.querySelector(
            'slot[name=suffix] > oryx-icon[type=search]'
          )
        ).to.exist;
      });
    });

    describe('when suffixFill is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control ?suffixFill=${true}></oryx-text-control>`
        );
      });
      it('should reflect the attribute on the host element', () => {
        expect(element.suffixFill).to.true;
      });
    });

    describe('when a suffixFill is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text-control></oryx-text-control>`);
      });
      it('should not have the attribute on the host element', () => {
        expect(element.suffixFill).not.to.exist;
      });
    });

    describe('when suffix content is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-text-control>
            <p slot="suffix">suffix content</p>
          </oryx-text-control>`
        );
      });
      it('should have .has-suffix-content class', () => {
        expect(element.classList.contains('has-suffix-content')).to.be.true;
      });
    });

    describe('when suffix content is not slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-text-control> </oryx-text-control>`);
      });
      it('should not have .has-suffix-content class', () => {
        expect(element.classList.contains('has-suffix-content')).to.be.false;
      });
    });
  });
});
