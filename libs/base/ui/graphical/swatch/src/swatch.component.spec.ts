import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { AlertType } from '@spryker-oryx/ui';
import { SwatchComponent } from './swatch.component';
import { swatchComponent } from './swatch.def';

const mockColor = 'red';

useComponent(swatchComponent);

describe('SwatchComponent', () => {
  let element: SwatchComponent;

  describe('when the type is Warning', () => {
    beforeAll(async () => {
      element = await fixture(
        html`<oryx-swatch .type=${AlertType.Warning}></oryx-swatch>`
      );
    });

    it('should render warning color', () => {
      expect(element.getAttribute('style')).contain(
        `--swatch: var(--oryx-color-warning-9)`
      );
    });
  });

  describe('when the type is Success', () => {
    beforeAll(async () => {
      element = await fixture(
        html`<oryx-swatch .type=${AlertType.Success}></oryx-swatch>`
      );
    });

    it('should render warning color', () => {
      expect(element.getAttribute('style')).contain(
        `--swatch: var(--oryx-color-success-9)`
      );
    });
  });

  describe('when the type is Error', () => {
    beforeAll(async () => {
      element = await fixture(
        html`<oryx-swatch .type=${AlertType.Error}></oryx-swatch>`
      );
    });

    it('should render warning color', () => {
      expect(element.getAttribute('style')).contain(
        `--swatch: var(--oryx-color-error-9)`
      );
    });
  });

  describe('when the type is Info', () => {
    beforeAll(async () => {
      element = await fixture(
        html`<oryx-swatch .type=${AlertType.Info}></oryx-swatch>`
      );
    });

    it('should render warning color', () => {
      expect(element.getAttribute('style')).contain(
        `--swatch: var(--oryx-color-info-9)`
      );
    });
  });

  describe('when a color is provided', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-swatch .color=${mockColor}></oryx-swatch>`
      );
    });

    it('should provide color prop value as --swatch css variable', async () => {
      expect(element.getAttribute('style')).toBe(`--swatch: ${mockColor}`);
    });
  });
});
