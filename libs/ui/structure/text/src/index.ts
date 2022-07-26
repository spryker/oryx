export * from './text.component';
export * from './text.model';
export * from './text.styles';

import { TAG_NAME, TextComponent } from './text.component';

customElements.get(TAG_NAME) || customElements.define(TAG_NAME, TextComponent);
