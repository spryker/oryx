import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductImagesComponent } from './images.component';
import { ProductImagesScrollBehavior } from './images.model';

export const productImagesComponentSchema: ContentComponentSchema<ProductImagesComponent> =
  {
    type: 'oryx-product-images',
    name: 'Product Images',
    group: 'Product',
    icon: IconTypes.Images,
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
