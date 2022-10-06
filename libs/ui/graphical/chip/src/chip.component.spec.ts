import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { a11yConfig } from '@spryker-oryx/typescript-utils';
import { ChipComponent } from './chip.component';
import { chipComponent } from './chip.def';
import { ChipAppearance } from './chip.model';

describe('ChipComponent', () => {
  let element: ChipComponent;

  beforeAll(async () => {
    await useComponent(chipComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-chip');
    expect(el).toBeInstanceOf(ChipComponent);
  });

  describe('chip type', () => {
    Object.values(Object.values(ChipAppearance)).forEach((type) => {
      describe(`when type is "${type}"`, () => {
        beforeEach(async () => {
          element = await fixture(html`<oryx-chip type="${type}"></oryx-chip>`);
        });

        it('passes the a11y audit', async () => {
          await expect(element).shadowDom.to.be.accessible(a11yConfig);
        });

        it('should reflect the type attribute on the node', () => {
          expect(element?.getAttribute('type')).toBe(type);
        });
      });
    });
  });
});
