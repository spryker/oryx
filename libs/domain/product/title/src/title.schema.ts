import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { LinkType } from '@spryker-oryx/ui/link';
import { ProductTitleComponent } from './title.component';

const tagOptions = [
  HeadingTag.H1,
  HeadingTag.H2,
  HeadingTag.H3,
  HeadingTag.H4,
  HeadingTag.H5,
  HeadingTag.H6,
  HeadingTag.Subtitle,
  HeadingTag.Caption,
].map((tag) => ({ value: tag }));

export const productTitleSchema: ContentComponentSchema<ProductTitleComponent> =
  {
    name: 'Product title',
    group: 'Product',
    icon: '<path d="M11.4149 2.00024C11.8698 1.99261 12.3094 2.16462 12.6383 2.47896L20.9094 10.7767C21.6151 11.459 22.0094 12.4014 22 13.383C21.9972 14.3622 21.6049 15.3 20.9094 15.9893L15.9627 20.9094C15.2804 21.6151 14.338 22.0094 13.3564 22C12.3772 21.9972 11.4394 21.6049 10.7501 20.9094L2.47896 12.6383C2.16462 12.3094 1.99261 11.8698 2.00024 11.4149L2.18641 3.80872C2.20879 2.92218 2.92218 2.20879 3.80872 2.18641L11.4149 2.00024ZM11.4681 3.59596L3.86191 3.78212C3.81897 3.78473 3.78473 3.81897 3.78212 3.86191L3.59596 11.4681C3.59596 11.4947 3.59596 11.4947 3.62255 11.5213L11.8937 19.7924C12.721 20.6034 14.045 20.6034 14.8723 19.7924L19.7924 14.8723C20.1868 14.4773 20.407 13.9411 20.4041 13.383C20.407 12.8248 20.1868 12.2887 19.7924 11.8937L11.5213 3.62255C11.4947 3.59596 11.4947 3.59596 11.4681 3.59596ZM7.57035 7.56854C8.71826 6.41833 10.5794 6.41833 11.7273 7.56854C12.8752 8.71874 12.8752 10.5836 11.7273 11.7338C11.1701 12.2761 10.4256 12.5822 9.64883 12.5882C8.45965 12.593 7.38546 11.8773 6.92974 10.7767C6.47403 9.67613 6.7271 8.40872 7.57035 7.56854ZM9.64883 8.31615C9.29739 8.32116 8.96217 8.46512 8.71618 8.71665C8.19373 9.24014 8.19373 10.0889 8.71618 10.6124C9.23862 11.1359 10.0857 11.1359 10.6081 10.6124C10.8569 10.3582 10.994 10.0149 10.989 9.65896C10.984 9.30298 10.8373 8.96375 10.5815 8.71665C10.3411 8.45701 10.0022 8.3115 9.64883 8.31615Z"/>',
    options: {
      tag: { type: FormFieldType.Select, options: tagOptions },
      maxLines: { type: FormFieldType.Number },
      linkType: {
        type: FormFieldType.Select,
        options: [
          { value: 'none' },
          { value: LinkType.Link },
          { value: LinkType.ExternalLink },
          { value: LinkType.Neutral },
        ],
        width: 100,
      },
      as: {
        type: FormFieldType.Select,
        options: [...tagOptions, { value: 'hide' }],
      },
      asLg: {
        type: FormFieldType.Select,
        options: [...tagOptions, { value: 'hide' }, { value: 'show' }],
      },
      asMd: {
        type: FormFieldType.Select,
        options: [...tagOptions, { value: 'hide' }, { value: 'show' }],
      },
      asSm: {
        type: FormFieldType.Select,
        options: [...tagOptions, { value: 'hide' }, { value: 'show' }],
      },
    },
  };
