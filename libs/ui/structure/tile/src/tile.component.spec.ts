import { fixture, html } from '@open-wc/testing-helpers';
import { queryFirstAssigned } from '../../../utilities';
import './index';
import { TileComponent } from './tile.component';

describe('TileComponent', () => {
  let element: TileComponent;

  it('is defined', () => {
    const el = document.createElement('oryx-tile');
    expect(el).toBeInstanceOf(TileComponent);
  });

  describe('tile component test', () => {
    beforeEach(async () => {
      element = await fixture(
        html` <oryx-tile><h2 id="header">Tile</h2></oryx-tile>`
      );
    });

    it('should be correct initialisation', () => {
      expect(queryFirstAssigned<HTMLHeadingElement>(element)?.id).toBe(
        'header'
      );
    });
  });
});
