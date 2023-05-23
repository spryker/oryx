import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { BannerComponent } from './banner.component';

export const bannerComponentSchema: ContentComponentSchema<BannerComponent> = {
  name: 'Image banner',
  group: 'Content',
  icon: IconTypes.Image,
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
