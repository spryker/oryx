import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { a11yConfig } from '../../../a11y';
import { OryxElement, queryFirstAssigned } from '../../../utilities';
import { LabelController } from './label.controller';
import { LabelOptions } from './label.model';

export class LabelComponent
  extends LitElement
  implements OryxElement<LabelOptions>
{
  @property({ type: Object }) options: LabelOptions = {};
  protected labelController = new LabelController(this);

  render(): TemplateResult {
    return html`
      <label>
        ${this.labelController.render()}
        <slot><input /></slot>
      </label>
    `;
  }
}
customElements.define('fake-label', LabelComponent);

describe('LabelController', () => {
  let element: LabelComponent;

  describe('label', () => {
    describe('when a label is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html` <fake-label
            .options=${{ label: 'label content' }}
          ></fake-label>`
        );
      });

      it('should render label content', () => {
        const label = queryFirstAssigned<HTMLDivElement>(element, {
          selector: 'div',
          slot: 'label',
          flatten: true,
        });
        expect(label?.innerText).to.equal('label content');
      });

      it('should have an "has-label" attribute', () => {
        expect(element.hasAttribute('has-label')).to.be.true;
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      describe('when custom label is provided in the label slot', () => {
        beforeEach(async () => {
          element = await fixture(html` <fake-label
            .options=${{ label: 'label content' }}
          >
            <h3>custom text</h3>
          </fake-label>`);
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not render a label element', () => {
          const customLabel = queryFirstAssigned(element, {
            flatten: true,
            slot: 'label',
            selector: 'h3',
          });
          expect(customLabel).not.to.exist;
        });
      });
    });

    describe('when no label is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-label></fake-label>`);
      });

      it('not passes the a11y audit', async () => {
        await expect(element).shadowDom.not.be.accessible(a11yConfig);
      });

      it('should not render a label element', () => {
        const label = queryFirstAssigned<HTMLDivElement>(element, {
          selector: 'div',
          slot: 'label',
          flatten: true,
        });
        expect(label).not.to.exist;
      });

      it('should not have an "has-label" attribute', () => {
        expect(element.hasAttribute('has-label')).to.be.false;
      });
    });

    describe('required notation', () => {
      describe('when the input is required', () => {
        describe('and the label does not have an asterisk', () => {
          beforeEach(async () => {
            element = await fixture(html` <fake-label
              .options=${{ label: 'test' }}
            >
              <input required />
            </fake-label>`);
          });

          it('passes the a11y audit', async () => {
            await expect(element).shadowDom.to.be.accessible(a11yConfig);
          });

          it('should have an asterisk', () => {
            const label = queryFirstAssigned<HTMLDivElement>(element, {
              slot: 'label',
              selector: 'div',
              flatten: true,
            });
            expect(label?.innerText.trim()).to.eq('test*');
          });
        });

        describe('and the label has an asterisk', () => {
          beforeEach(async () => {
            element = await fixture(html` <fake-label
              .options=${{ label: 'test*' }}
            >
              <input required />
            </fake-label>`);
          });

          it('passes the a11y audit', async () => {
            await expect(element).shadowDom.to.be.accessible(a11yConfig);
          });

          it('should not add an additional asterisk', () => {
            const label = queryFirstAssigned<HTMLDivElement>(element, {
              slot: 'label',
              selector: 'div',
              flatten: true,
            });
            expect(label?.innerText.trim()).to.not.eq('text*');
          });
        });
      });

      describe('when the input is not required', () => {
        beforeEach(async () => {
          element = await fixture(html` <fake-label
            .options=${{ label: 'test' }}
          >
            <input />
          </fake-label>`);
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should show a <sup>*</sup>', () => {
          expect(element.renderRoot.querySelector('sup')).to.not.exist;
        });
      });
    });
  });
});
