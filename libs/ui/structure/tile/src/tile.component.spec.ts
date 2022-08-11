import { fixture, html } from '@open-wc/testing-helpers';
import { useComponent } from '@spryker-oryx/core/utilities';
import { queryFirstAssigned } from '@spryker-oryx/typescript-utils';
import { tileComponent } from './index';
import { TileComponent } from './tile.component';

useComponent(tileComponent);

describe('TileComponent', () => {
  let element: TileComponent;

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
