import { ChipComponent } from './chip.component';

export * from './chip.component';
export * from './chip.model';
export * from './chip.styles';

customElements.get('oryx-chip') ||
  customElements.define('oryx-chip', ChipComponent);
