export * from './typeahead.component';
export * from './typeahead.controller';
export * from './typeahead.model';
export * from './typeahead.styles';

import { TypeaheadComponent } from './typeahead.component';

customElements.get('oryx-typeahead') ||
  customElements.define('oryx-typeahead', TypeaheadComponent);
