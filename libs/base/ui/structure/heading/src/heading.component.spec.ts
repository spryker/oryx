import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/utilities';
import { HeadingComponent } from './heading.component';
import { headingComponent } from './heading.def';

describe('HeadingComponent', () => {
  let element: HeadingComponent;

  beforeAll(async () => {
    await useComponent(headingComponent);
  });

  describe('when a tag is provided', () => {
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag) => {
      describe(`and the tag is ${tag}`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-heading tag=${tag}>heading</oryx-heading>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible();
        });

        it(`should render an ${tag} element`, () => {
          expect(element).toContainElement(tag);
        });
      });
    });

    describe(`and the tag is 'subtitle'`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-heading tag="subtitle">heading</oryx-heading>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it(`should render an b element`, () => {
        expect(element).toContainElement('b.subtitle');
      });
    });

    describe(`when the tag is unknown`, () => {
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-heading tag="unknown">heading</oryx-heading>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible();
      });

      it(`should not render an element`, () => {
        expect(element).not.toContainElement('h1');
        expect(element).not.toContainElement('h2');
        expect(element).not.toContainElement('h3');
        expect(element).not.toContainElement('h4');
        expect(element).not.toContainElement('h5');
        expect(element).not.toContainElement('h6');
        expect(element).not.toContainElement('b.subtitle');
      });

      it(`should render a slot`, () => {
        expect(element).toContainElement('slot');
      });
    });
  });
});
