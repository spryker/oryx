import { fixture, html } from '@open-wc/testing-helpers';
import { getShadowElementBySelector } from '@spryker-oryx/testing';
import { LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { a11yConfig } from '../../../../a11y';
import { AffixController } from './affix.controller';
import { AffixOptions } from './affix.model';

@customElement('fake-affix')
class AffixComponent extends LitElement implements AffixOptions {
  protected affixController = new AffixController(this);

  @property() prefixIcon?: string;
  @property({ type: Boolean }) prefixFill?: boolean;
  @property() suffixIcon?: string;
  @property({ type: Boolean }) suffixFill?: boolean;

  render(): TemplateResult {
    return html`${this.affixController.renderPrefix()}${this.affixController.renderSuffix()}`;
  }
}

describe('AffixController', () => {
  let element: AffixComponent;

  describe('prefix', () => {
    describe('when a prefixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-affix prefixIcon="search"></fake-affix>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should render the icon in the prefix slot', () => {
        expect(
          getShadowElementBySelector(element, 'slot[name=prefix] > oryx-icon')
        ).not.toBeNull();
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
        expect(element.classList.contains('has-prefix-content')).toBe(false);
      });
    });

    describe('when prefix fill is set to true', () => {
      describe('and a prefix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix
              ?prefixFill=${true}
              prefixIcon="foo-bar"
            ></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).toBe(true);
        });
      });

      describe('and a prefix icon is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix ?prefixFill=${true}></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).toBe(false);
        });

        describe('but light dom is provided for the prefix slot ', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<fake-affix ?prefixFill=${true}>
                <div slot="prefix">test</div></fake-affix
              >`
            );
          });

          it('passes the a11y audit', async () => {
            await expect(element).shadowDom.to.be.accessible(a11yConfig);
          });

          it('should have prefix-fill attribute', () => {
            expect(element.hasAttribute('prefix-fill')).toBe(true);
          });
        });
      });
    });

    describe('when prefix fill is set to false', () => {
      describe('and a prefix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix prefixIcon="foo-bar"></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).toBe(false);
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
          expect(element.hasAttribute('prefix-fill')).toBe(false);
        });
      });
    });

    describe('when prefix fill is not provided', () => {
      describe('and a prefix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix prefixIcon="foo-bar"></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have prefix-fill attribute', () => {
          expect(element.hasAttribute('prefix-fill')).toBe(false);
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
          expect(element.hasAttribute('prefix-fill')).toBe(false);
        });
      });
    });
  });

  describe('suffix', () => {
    describe('when a suffixIcon is provided', () => {
      beforeEach(async () => {
        element = await fixture(
          html`<fake-affix suffixIcon="search"></fake-affix>`
        );
      });
      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should render the icon in the suffix slot', () => {
        expect(
          getShadowElementBySelector(element, 'slot[name=suffix] > oryx-icon')
        ).not.toBeNull();
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
        expect(element.classList.contains('has-suffix-content')).toBe(false);
      });
    });

    describe('when suffix fill is set to true', () => {
      describe('and a suffix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix
              ?suffixFill=${true}
              suffixIcon="foo-bar"
            ></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).toBe(true);
        });
      });

      describe('and a suffix icon is not provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix ?suffixFill=${true}></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).toBe(false);
        });

        describe('but light dom is provided for the suffix slot ', () => {
          beforeEach(async () => {
            element = await fixture(
              html`<fake-affix ?suffixFill=${true}>
                <div slot="suffix">test</div></fake-affix
              >`
            );
          });
          it('passes the a11y audit', async () => {
            await expect(element).shadowDom.to.be.accessible(a11yConfig);
          });

          it('should have suffix-fill attribute', () => {
            expect(element.hasAttribute('suffix-fill')).toBe(true);
          });
        });
      });
    });

    describe('when suffix fill is set to false', () => {
      describe('and a suffix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix
              ?suffixFill=${false}
              suffixIcon="foo-bar"
            ></fake-affix>`
          );
        });
        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).toBe(false);
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
          expect(element.hasAttribute('suffix-fill')).toBe(false);
        });
      });
    });

    describe('when suffix fill is not provided', () => {
      describe('and a suffix icon is provided', () => {
        beforeEach(async () => {
          element = await fixture(
            html`<fake-affix suffixIcon="foo-bar"></fake-affix>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should not have suffix-fill attribute', () => {
          expect(element.hasAttribute('suffix-fill')).toBe(false);
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
          expect(element.hasAttribute('suffix-fill')).toBe(false);
        });
      });
    });
  });
});
