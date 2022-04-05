import { TileComponent } from './tile.component';

export * from './tile.component';
export * from './tile.styles';

customElements.get('oryx-tile') ||
  customElements.define('oryx-tile', TileComponent);
