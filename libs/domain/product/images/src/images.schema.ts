import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { ProductImagesComponent } from './images.component';
import { ProductImagesScrollBehavior } from './images.model';

export const productImagesComponentSchema: ContentComponentSchema<ProductImagesComponent> =
  {
    type: 'oryx-product-images',
    name: 'Product Images',
    group: 'Product',
    icon: '<path d="M9.075 13.85H18.425L15.325 9.775L12.95 12.8L11.375 10.875L9.075 13.85ZM8.05 17.5C7.55 17.5 7.125 17.325 6.775 16.975C6.425 16.625 6.25 16.2 6.25 15.7V4.3C6.25 3.8 6.425 3.375 6.775 3.025C7.125 2.675 7.55 2.5 8.05 2.5H19.45C19.95 2.5 20.375 2.675 20.725 3.025C21.075 3.375 21.25 3.8 21.25 4.3V15.7C21.25 16.2 21.075 16.625 20.725 16.975C20.375 17.325 19.95 17.5 19.45 17.5H8.05ZM8.05 16H19.45C19.5167 16 19.5833 15.9667 19.65 15.9C19.7167 15.8333 19.75 15.7667 19.75 15.7V4.3C19.75 4.23333 19.7167 4.16667 19.65 4.1C19.5833 4.03333 19.5167 4 19.45 4H8.05C7.98333 4 7.91667 4.03333 7.85 4.1C7.78333 4.16667 7.75 4.23333 7.75 4.3V15.7C7.75 15.7667 7.78333 15.8333 7.85 15.9C7.91667 15.9667 7.98333 16 8.05 16ZM4.55 21C4.05 21 3.625 20.825 3.275 20.475C2.925 20.125 2.75 19.7 2.75 19.2V6.3H4.25V19.2C4.25 19.2667 4.28333 19.3333 4.35 19.4C4.41667 19.4667 4.48333 19.5 4.55 19.5H17.45V21H4.55Z"/>',
    options: {
      mediaSet: {
        type: 'input',
      },
      imageLayout: {
        type: 'select',
        options: [{ value: 'carousel' }, { value: 'grid' }, { value: 'none' }],
      },
      scrollBehavior: {
        type: 'select',
        options: [
          { value: ProductImagesScrollBehavior.Auto },
          { value: ProductImagesScrollBehavior.Disable },
          { value: ProductImagesScrollBehavior.Smooth },
        ],
      },
      navigationDisplay: {
        type: 'select',
        options: [
          { value: 'inline' },
          { value: 'floating' },
          { value: 'none' },
        ],
      },
      navigationPosition: {
        type: 'select',
        options: [
          { value: 'top' },
          { value: 'bottom' },
          { value: 'start' },
          { value: 'end' },
        ],
      },
      navigationAlignment: {
        type: 'select',
        options: [{ value: 'start' }, { value: 'center' }, { value: 'end' }],
      },
      navigationLayout: {
        type: 'select',
        options: [{ value: 'carousel' }, { value: 'grid' }],
      },
      navigationMouseEvent: {
        type: 'select',
        options: [{ value: 'click' }, { value: 'mouseover' }],
      },
      imageHeight: { type: 'input' },
      imageWidth: { type: 'input' },
      navigationHeight: { type: 'input' },
      navigationWidth: { type: 'input' },
      navigationObjectFit: {
        type: FormFieldType.Select,
        options: [{ value: 'contain' }, { value: 'cover' }, { value: 'none' }],
      },
      imageObjectFit: {
        type: FormFieldType.Select,
        options: [{ value: 'contain' }, { value: 'cover' }, { value: 'none' }],
      },
      imagesColumns: {
        type: 'input',
        attributes: {
          type: 'number',
        },
      },
    },
  };
