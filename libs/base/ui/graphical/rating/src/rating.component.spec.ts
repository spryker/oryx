import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { ratingComponent } from './component';
import { RatingComponent } from './rating.component';

describe('RatingComponent', () => {
  let element: RatingComponent;

  beforeAll(async () => {
    await useComponent(ratingComponent);
  });

  describe('scale', () => {
    describe('when no scale is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-rating></oryx-rating>`);
      });
      it('should have 5 rating symbols', () => {
        expect(element.renderRoot?.querySelectorAll('input').length).toBe(
          element.scale
        );
      });
    });
    describe('when a scale is provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-rating scale="7"></oryx-rating>`);
      });
      it('should have 7 rating symbols', () => {
        expect(element.renderRoot?.querySelectorAll('input').length).toBe(7);
      });
    });
  });

  describe('when an undefined value is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-rating .value=${undefined}></oryx-rating>`
      );
    });
    it('should have a --rate variable of 0', () => {
      expect(
        element.shadowRoot
          ?.querySelector('fieldset')
          ?.style.getPropertyValue('--rate')
      ).toEqual('0');
    });
  });

  describe('when a valid value is provided', () => {
    describe('and the value matches a rating symbol', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-rating value="3"></oryx-rating>`);
      });

      it('should select the associated element', () => {
        const inputs = element.renderRoot?.querySelectorAll('input');
        expect(inputs[0].checked).toBe(false);
        expect(inputs[1].checked).toBe(false);
        expect(inputs[2].checked).toBe(true);
        expect(inputs[3].checked).toBe(false);
        expect(inputs[4].checked).toBe(false);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });
    });

    describe('and the value is a float (3.2)', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-rating value="3.2"></oryx-rating>`);
      });

      it('should select the rounded value', () => {
        const input = element.renderRoot?.querySelector(
          'input[value="3"]'
        ) as HTMLInputElement;
        expect(input.checked).toBe(true);
      });
    });

    describe('and the value is a float (3.6)', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-rating value="3.6"></oryx-rating>`);
      });

      it('should select the rounded value', () => {
        const input = element.renderRoot?.querySelector(
          'input[value="4"]'
        ) as HTMLInputElement;
        expect(input.checked).toBe(true);
      });
    });
  });

  describe('when the readonly attribute is not set', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-rating></oryx-rating>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should enable all inputs', () => {
      expect(
        element.renderRoot?.querySelectorAll('input:not([disabled])').length
      ).toBe(element.scale);
    });

    it('should set the required flag for each input', () => {
      expect(
        element.renderRoot?.querySelectorAll('input[required]').length
      ).toBe(element.scale);
    });

    describe('and an input event is dispatched on the 3rd symbol', () => {
      beforeEach(() => {
        const inputs = element.renderRoot?.querySelectorAll('input');
        inputs[2].dispatchEvent(
          new InputEvent('input', { bubbles: true, composed: true })
        );
      });
      it('should set the value to "3"', () => {
        expect(element.value).toBe(3);
      });
    });
  });

  describe('when the readonly attribute is set', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-rating readonly></oryx-rating>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });

    it('should set the disabled flag for each input', () => {
      expect(
        element.renderRoot?.querySelectorAll('input[disabled]').length
      ).toBe(element.scale);
    });

    it('should not render a slots', () => {
      expect(element.renderRoot?.querySelectorAll('slot').length).toBe(0);
    });
  });

  describe('characters', () => {
    describe('when no characters are provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-rating></oryx-rating>`);
      });
      it('should not render content in slots', () => {
        expect(
          element.renderRoot
            ?.querySelector('slot[name="1"]')
            ?.textContent?.trim()
        ).toBe('');
      });
    });

    describe('when characters are provided', () => {
      const characters = '😡😔😐😀🤩';
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-rating characters=${characters}></oryx-rating>`
        );
      });
      it('should render a has-char attribute on each slot', () => {
        expect(
          element.renderRoot?.querySelectorAll('slot[name][has-char]').length
        ).toBe(5);
      });

      [...characters].forEach((c, i) => {
        it(`should render the ${c} character in the slot ${i}`, () => {
          expect(
            element.renderRoot?.querySelector(`slot[name="${i + 1}"]`)
              ?.textContent
          ).toBe(c);
        });
      });
    });

    describe('when only 3 characters are provided', () => {
      const characters = '123';
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-rating characters=${characters}></oryx-rating>`
        );
      });

      const getElement = (index: number): Element | null =>
        element.renderRoot?.querySelector(`slot[name="${index + 1}"]`);

      characters
        .split('')
        .concat(['', ''])
        .forEach((c, i) => {
          if (c) {
            it(`should render the ${c} character in the slot ${i}`, () => {
              expect(getElement(i)?.textContent).toBe(c);
            });

            it(`should render a has-char attribute in the slot ${i}`, () => {
              expect(getElement(i)?.hasAttribute('has-char')).toBe(true);
            });
          } else {
            it(`should not render any character in the slot ${i}`, () => {
              expect(getElement(i)?.textContent?.trim()).toBe('');
            });

            it(`should not render a has-char attribute in the slot ${i}`, () => {
              expect(getElement(i)?.hasAttribute('has-char')).toBe(false);
            });
          }
        });
    });
  });

  describe('review count', () => {
    describe('when the reviewCount is not provided', () => {
      beforeEach(async () => {
        element = await fixture(html`<oryx-rating></oryx-rating>`);
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should not render the reviewCount', () => {
        expect(element.renderRoot?.querySelector('.review-count')).toBe(null);
      });
    });

    describe('when the reviewCount is provided', () => {
      const reviewCount = '12.3K';
      beforeEach(async () => {
        element = await fixture(
          html`<oryx-rating .reviewCount=${reviewCount}></oryx-rating>`
        );
      });

      it('passes the a11y audit', async () => {
        await expect(element).shadowDom.to.be.accessible(a11yConfig);
      });

      it('should render the reviewCount', () => {
        expect(
          element.renderRoot?.querySelector('.review-count')?.textContent
        ).toBe(reviewCount);
      });
    });
  });
});
