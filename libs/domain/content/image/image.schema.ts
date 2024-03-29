import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { featureVersion } from '@spryker-oryx/utilities';
import { ContentImageComponent } from './image.component';

export const contentImageComponentSchema: ContentComponentSchema<ContentImageComponent> =
  {
    name: 'Image',
    group: 'Content',
    icon: IconTypes.Image,
    options:
      featureVersion >= '1.4'
        ? {}
        : {
            fit: {
              type: FormFieldType.Select,
              options: [
                { value: 'none' },
                { value: 'contain' },
                { value: 'cover' },
              ],
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
