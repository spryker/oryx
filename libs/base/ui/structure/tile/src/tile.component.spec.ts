import { fixture, html } from '@open-wc/testing-helpers';
import { queryFirstAssigned, useComponent } from '@spryker-oryx/utilities';
import { tileComponent } from './component';
import { TileComponent } from './tile.component';

describe('TileComponent', () => {
  let element: TileComponent;

  beforeAll(async () => {
    await useComponent(tileComponent);
  });

  it('is defined', () => {
    const el = document.createElement('oryx-tile');
    expect(el).toBeInstanceOf(TileComponent);
  });

  describe('tile component test', () => {
    beforeEach(async () => {
      element = await fixture(
        html`<oryx-tile>
          <h2 id="header">Tile</h2>
        </oryx-tile>`
      );
    });

    it('should be correct initialisation', () => {
      expect(queryFirstAssigned<HTMLHeadingElement>(element)?.id).toBe(
        'header'
      );
    });
  });
});
