import { fixture, html } from '@open-wc/testing-helpers';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { MultiRangeComponent } from './multi-range.component';
import { multiRangeComponent } from './multi-range.def';

describe('MultiRangeComponent', () => {
  let element: MultiRangeComponent;

  beforeAll(async () => {
    await useComponent(multiRangeComponent);
  });

  it('is defined', () => {
    const element = document.createElement('oryx-multi-range');

    expect(element).toBeInstanceOf(MultiRangeComponent);
  });

  describe('when the element is created', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-multi-range></oryx-multi-range>`);
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });
  });

  describe('when component is disabled', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range disabled></oryx-multi-range>`
      );
    });

    it('element is disabled', () => {
      expect(element.disabled).toBe(true);
    });

    it('first thumb is also disabled', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.disabled).toBe(
        true
      );
    });

    it('second thumb is also disabled', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[1]?.disabled).toBe(
        true
      );
    });

    it('passes the a11y audit', async () => {
      await expect(element).shadowDom.to.be.accessible(a11yConfig);
    });
  });

  describe('when component is not disabled', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-multi-range></oryx-multi-range>`);
    });

    it('element is not disabled', () => {
      expect(element.disabled).not.toBeDefined();
    });

    it('first thumb is also not disabled', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.disabled).toBe(
        false
      );
    });

    it('second thumb is also not disabled', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[1]?.disabled).toBe(
        false
      );
    });
  });

  describe('step property is not set', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-multi-range></oryx-multi-range>`);
    });

    it('default value 1 should be reflected to the first range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.step).toBe('1');
    });

    it('default value 1 should be reflected to the second range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[1]?.step).toBe('1');
    });
  });

  describe('step property is set to 3', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range step="3"></oryx-multi-range>`
      );
    });

    it('should be reflected to the first range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.step).toBe('3');
    });

    it('should be reflected to the second range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[1]?.step).toBe('3');
    });
  });

  describe('min property is not set', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-multi-range></oryx-multi-range>`);
    });

    it('default value 0 should be reflected to the first range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.min).toBe('0');
    });

    it('default value 0 should be reflected to the second range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[1]?.min).toBe('0');
    });
  });

  describe('min property is set 2', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range min="2"></oryx-multi-range>`
      );
    });

    it('value 2 should be reflected to the first range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.min).toBe('2');
    });

    it('value 2 should be reflected to the second range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[1]?.min).toBe('2');
    });
  });

  describe('max property is not set', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-multi-range></oryx-multi-range>`);
    });

    it('default value 100 should be reflected to the first range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.max).toBe('100');
    });

    it('default value 100 should be reflected to the second range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[1]?.max).toBe('100');
    });
  });

  describe('max property is set to 20', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range max="20"></oryx-multi-range>`
      );
    });

    it('value 20 should be reflected to the first range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.max).toBe('20');
    });

    it('value 20 should be reflected to the second range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[1]?.max).toBe('20');
    });
  });

  describe('minValue property is not set', () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-multi-range></oryx-multi-range>`);
    });

    it('default value 0 should be reflected to the first range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.value).toBe('0');
    });
  });

  describe('minValue property is set to 5', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range minValue="5"></oryx-multi-range>`
      );
    });

    it('value 5 should be reflected to the first range input', () => {
      expect(element.shadowRoot?.querySelectorAll('input')[0]?.value).toBe('5');
    });
  });

  describe('minValue property is set to the value bigger then maxValue', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range maxValue="10"></oryx-multi-range>`
      );
    });

    it('minValue should be one step less then maxValue', async () => {
      element.minValue = 11;

      await expect(element.minValue).toBe(9);
    });
  });

  describe('minValue property is set to the value less then min', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range min="0" minValue="-1"></oryx-multi-range>`
      );
    });

    it('minValue should be equal to min', async () => {
      await expect(element.minValue).toBe(0);
    });
  });

  describe('maxValue property is set to the value less then minValue', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range minValue="1"></oryx-multi-range>`
      );
    });

    it('maxValue should be one step bigger then minValue', async () => {
      element.maxValue = 0;

      await expect(element.maxValue).toBe(2);
    });
  });

  describe('maxValue property is set to the value bigger then max', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range max="10" maxValue="11"></oryx-multi-range>`
      );
    });

    it('maxValue should be equal to max', async () => {
      await expect(element.maxValue).toBe(10);
    });
  });

  describe('maxValue property is set to the value bigger then max', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-multi-range max="10" maxValue="11"></oryx-multi-range>`
      );
    });

    it('maxValue should be equal to max', async () => {
      await expect(element.maxValue).toBe(10);
    });
  });
});
