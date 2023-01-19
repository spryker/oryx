import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { SwatchComponent } from './swatch.component';
import { swatchComponent } from './swatch.def';

const mockColor = 'red';

useComponent(swatchComponent);

describe('SwatchComponent', () => {
  let element: SwatchComponent;

  beforeAll(async () => {
    element = await fixture(
      html`<oryx-swatch .color=${mockColor}></oryx-swatch>`
    );
  });

  it('is defined', async () => {
    expect(element).toBeInstanceOf(SwatchComponent);
  });

  it('should provide color prop value as --swatch css variable', async () => {
    expect(element.getAttribute('style')).toBe(`--swatch: ${mockColor}`);
  });
});
