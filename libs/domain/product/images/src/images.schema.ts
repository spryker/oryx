import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductImagesComponent } from './images.component';
import { ProductImagesScrollBehavior } from './images.model';

export const productImagesComponentSchema: ContentComponentSchema<ProductImagesComponent> =
  {
    name: 'Product Images',
    group: 'Product',
    icon: IconTypes.Images,
    options: {
      mediaSet: {
        type: FormFieldType.Text,
      },
      imageLayout: {
        type: FormFieldType.Select,
        options: [{ value: 'carousel' }, { value: 'grid' }, { value: 'none' }],
      },
      scrollBehavior: {
        type: FormFieldType.Select,
        options: [
          { value: ProductImagesScrollBehavior.Auto },
          { value: ProductImagesScrollBehavior.Disable },
          { value: ProductImagesScrollBehavior.Smooth },
        ],
      },
      navigationDisplay: {
        type: FormFieldType.Select,
        options: [
          { value: 'inline' },
          { value: 'floating' },
          { value: 'none' },
        ],
      },
      navigationPosition: {
        type: FormFieldType.Select,
        options: [
          { value: 'top' },
          { value: 'bottom' },
          { value: 'start' },
          { value: 'end' },
        ],
      },
      navigationAlignment: {
        type: FormFieldType.Select,
        options: [{ value: 'start' }, { value: 'center' }, { value: 'end' }],
      },
      navigationLayout: {
        type: FormFieldType.Select,
        options: [{ value: 'carousel' }, { value: 'grid' }],
      },
      navigationMouseEvent: {
        type: FormFieldType.Select,
        options: [{ value: 'click' }, { value: 'mouseover' }],
      },
      imageHeight: { type: FormFieldType.Text },
      imageWidth: { type: FormFieldType.Text },
      navigationHeight: { type: FormFieldType.Text },
      navigationWidth: { type: FormFieldType.Text },
      navigationObjectFit: {
        type: FormFieldType.Select,
        options: [{ value: 'contain' }, { value: 'cover' }, { value: 'none' }],
      },
      imageObjectFit: {
        type: FormFieldType.Select,
        options: [{ value: 'contain' }, { value: 'cover' }, { value: 'none' }],
      },
      imagesColumns: {
        type: FormFieldType.Number,
      },
    },
  };
