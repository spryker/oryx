import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { AlertType } from '@spryker-oryx/ui';
import { SwatchComponent } from './swatch.component';
import { swatchComponent } from './swatch.def';

const mockColor = 'red';

describe('SwatchComponent', () => {
  let element: SwatchComponent;

  beforeAll(async () => {
    await useComponent(swatchComponent);
  });

  describe('when the type is Warning', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-swatch .type=${AlertType.Warning}></oryx-swatch>`
      );
    });

    it('should render warning color', () => {
      expect(element.getAttribute('style')).toContain(
        `--swatch: var(--oryx-color-warning-9)`
      );
    });
  });

  describe('when the type is Success', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-swatch .type=${AlertType.Success}></oryx-swatch>`
      );
    });

    it('should render warning color', () => {
      expect(element.getAttribute('style')).toContain(
        `--swatch: var(--oryx-color-success-9)`
      );
    });
  });

  describe('when the type is Error', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-swatch .type=${AlertType.Error}></oryx-swatch>`
      );
    });

    it('should render warning color', () => {
      expect(element.getAttribute('style')).toContain(
        `--swatch: var(--oryx-color-error-9)`
      );
    });
  });

  describe('when the type is Info', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-swatch .type=${AlertType.Info}></oryx-swatch>`
      );
    });

    it('should render warning color', () => {
      expect(element.getAttribute('style')).toContain(
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
