import { fixture, html } from '@open-wc/testing-helpers';
import { AlertType } from '@spryker-oryx/ui';
import { a11yConfig, useComponent } from '@spryker-oryx/utilities';
import { ChipComponent } from './chip.component';
import { chipComponent } from './chip.def';

describe('ChipComponent', () => {
  let element: ChipComponent;

  beforeAll(async () => {
    await useComponent(chipComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-chip');
    expect(el).toBeInstanceOf(ChipComponent);
  });

  describe(`when appearance is provided`, () => {
    [
      'default',
      AlertType.Info,
      AlertType.Success,
      AlertType.Warning,
      AlertType.Error,
    ].forEach((appearance) => {
      describe(`and the appearance is "${appearance}"`, () => {
        beforeEach(async () => {
          element = await fixture(
            html`<oryx-chip .appearance=${appearance}></oryx-chip>`
          );
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should reflect the type attribute', () => {
          expect(element?.getAttribute('appearance')).toBe(appearance);
        });
      });
    });
  });

  describe(`when invert is provided`, () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-chip ?invert=${true}></oryx-chip>`);
    });

    it('should reflect the type attribute', () => {
      expect(element?.hasAttribute('invert')).toBe(true);
    });
  });

  describe(`when dense is provided`, () => {
    beforeEach(async () => {
      element = await fixture(html`<oryx-chip ?dense=${true}></oryx-chip>`);
    });

    it('should reflect the dense attribute', () => {
      expect(element?.hasAttribute('dense')).toBe(true);
    });
  });
});
