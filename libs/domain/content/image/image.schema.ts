import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { FormFieldType } from 'libs/platform/form/src';
import { ContentImageComponent } from './image.component';

export const contentImageComponentSchema: ContentComponentSchema<ContentImageComponent> =
  {
    name: 'Image',
    group: 'Content',
    icon: IconTypes.Image,
    options: {
      fit: {
        type: FormFieldType.Select,
        options: [{ value: 'none' }, { value: 'contain' }, { value: 'cover' }],
      },
      position: { type: FormFieldType.Text },
    },
    content: {
      alt: { type: FormFieldType.Text },
      link: { type: FormFieldType.Text },
      graphic: {
        label: 'Resource from preset',
        type: 'graphics',
        placeholder: 'No Graphic',
        width: 100,
      },
      image: {
        type: 'imageWidget',
        width: 100,
      },
    },
  };
