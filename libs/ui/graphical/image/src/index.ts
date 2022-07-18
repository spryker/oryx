import { ImageComponent, TAG_NAME } from './image.component';

export * from './image.component';
export * from './image.styles';

customElements.get(TAG_NAME) || customElements.define(TAG_NAME, ImageComponent);
