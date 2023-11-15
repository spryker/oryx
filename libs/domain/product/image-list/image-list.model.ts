import { ProductMediaContainerSize } from '../src/models';

export interface ProductImageListComponentOptions {
  mediaSet?: string;

  size?: ProductMediaContainerSize;

  navigate?: ProductImageListNavigate;
}

export const enum ProductImageListNavigate {
  None = 'none',
  Click = 'click',
  Hover = 'hover',
}
