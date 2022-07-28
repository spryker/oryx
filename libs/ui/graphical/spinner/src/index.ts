export * from './spinner.component';
export * from './spinner.model';
export * from './spinner.styles';

import { SpinnerComponent } from './spinner.component';

customElements.get('oryx-spinner') ||
  customElements.define('oryx-spinner', SpinnerComponent);
