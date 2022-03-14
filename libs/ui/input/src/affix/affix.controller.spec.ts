import { expect, fixture, html } from '@open-wc/testing';
import { LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { a11yConfig } from '../../../a11y';
import { OryxElement } from '../../../utilities';
import { AffixController } from './affix.controller';
import { AffixOptions } from './affix.model';

export class AffixComponent
  extends LitElement
  implements OryxElement<AffixOptions>
{
  @property({ type: Object }) options: AffixOptions = {};
  protected affixController = new AffixController(this);

  render(): TemplateResult {
    return html`${this.affixController.renderPrefix()}${this.affixController.renderSuffix()}`;
  }
}
customElements.define('fake-affix', AffixComponent);

describe('AffixController', () => {
  let element: AffixComponent;

  describe('prefix', () => {
    describe('when a prefixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-affix .options=${{ prefixIcon: 'search' }}></fake-affix>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should render the icon in the prefix slot', () => {
        expect(
          element.shadowRoot?.querySelector('slot[name=prefix] > oryx-icon')
        ).to.exist;
      });
    });

    describe('when no prefix content is slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-affix></fake-affix>`);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have .has-prefix-content class', () => {
        expect(element.classList.contains('has-prefix-content')).to.be.false;
      });
    });

    describe('when prefix fill is set to true', () => {
      describe('and a prefix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix
              .options=${{ prefixFill: true, prefixIcon: 'foo-bar' }}
            ></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).to.be.true;
        });
      });

      describe('and a prefix icon is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix .options=${{ prefixFill: true }}></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).to.be.false;
        });

        describe('but light dom is provided for the prefix slot ', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<fake-affix .options=${{ prefixFill: true }}>
                <div slot="prefix">test</div></fake-affix
              >`
            );
          });

          it('passes the a11y audit', async () => {
            await expect(element).shadowDom.to.be.accessible(a11yConfig);
          });

          it('should have prefix-fill attribute', () => {
            expect(element.hasAttribute('prefix-fill')).to.be.true;
          });
        });
      });
    });

    describe('when prefix fill is set to false', () => {
      describe('and a prefix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix
              .options=${{ prefixFill: false, prefixIcon: 'foo-bar' }}
            ></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).to.be.false;
        });
      });

      describe('and light dom is provided for the prefix slot ', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix><div slot="prefix">test</div></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).to.be.false;
        });
      });
    });

    describe('when prefix fill is not provided', () => {
      describe('and a prefix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix
              .options=${{ prefixIcon: 'foo-bar' }}
            ></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).to.be.false;
        });
      });

      describe('and light dom is provided for the prefix slot ', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix><div slot="prefix">test</div></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).to.be.false;
        });
      });
    });
  });

  describe('suffix', () => {
    describe('when a suffixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-affix .options=${{ suffixIcon: 'search' }}></fake-affix>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should render the icon in the suffix slot', () => {
        expect(
          element.shadowRoot?.querySelector('slot[name=suffix] > oryx-icon')
        ).to.exist;
      });
    });

    describe('when suffix content is not slotted in', () => {
      beforeEach(async () => {
        element = await fixture(html`<fake-affix></fake-affix>`);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not have .has-suffix-content class', () => {
        expect(element.classList.contains('has-suffix-content')).to.be.false;
      });
    });

    describe('when suffix fill is set to true', () => {
      describe('and a suffix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix
              .options=${{ suffixFill: true, suffixIcon: 'foo-bar' }}
            ></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).to.be.true;
        });
      });

      describe('and a suffix icon is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix .options=${{ suffixFill: true }}></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).to.be.false;
        });

        describe('but light dom is provided for the suffix slot ', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<fake-affix .options=${{ suffixFill: true }}>
                <div slot="suffix">test</div></fake-affix
              >`
            );
          });

          it('passes the a11y audit', async () => {
            await expect(element).shadowDom.to.be.accessible(a11yConfig);
          });

          it('should have suffix-fill attribute', () => {
            expect(element.hasAttribute('suffix-fill')).to.be.true;
          });
        });
      });
    });

    describe('when suffix fill is set to false', () => {
      describe('and a suffix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix
              .options=${{ suffixFill: false, suffixIcon: 'foo-bar' }}
            ></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).to.be.false;
        });
      });

      describe('and light dom is provided for the suffix slot ', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix><div slot="suffix">test</div></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).to.be.false;
        });
      });
    });

    describe('when suffix fill is not provided', () => {
      describe('and a suffix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix
              .options=${{ suffixIcon: 'foo-bar' }}
            ></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).to.be.false;
        });
      });

      describe('and light dom is provided for the suffix slot ', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix><div slot="suffix">test</div></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).to.be.false;
        });
      });
    });
  });
});
