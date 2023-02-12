import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { BannerComponent } from './banner.component';

export const bannerComponentSchema: ContentComponentSchema<BannerComponent> = {
  name: 'Image banner',
  group: 'Content',
  category: 'Standard Cms',
  icon: '<path d="M2 14H22L16 3L11 11L7 7.5L2 14Z" /><path d="M2 19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19V18C22 17.4477 21.5523 17 21 17H3C2.44772 17 2 17.4477 2 18V19Z" />',
  content: {
    title: {
      label: 'Heading',
      type: FormFieldType.Text,
      width: 100,
    },
    graphic: {
      label: 'Preset',
      type: 'graphics',
      placeholder: 'No Graphic',
      width: 100,
    },
    image: {
      label: 'Image',
      type: 'imageWidget',
      width: 100,
    },
    content: {
      label: 'Content',
      type: FormFieldType.Textarea,
      width: 100,
    },
  },
  options: {
    link: {
      label: 'Url',
      type: FormFieldType.Text,
    },
    urlTarget: {
      label: 'Url Target',
      type: FormFieldType.Text,
    },
    alt: {
      label: 'Alt Text',
      type: FormFieldType.Text,
    },
    objectFit: {
      type: FormFieldType.Select,
      options: [{ value: 'none' }, { value: 'contain' }, { value: 'cover' }],
    },
  },
};
