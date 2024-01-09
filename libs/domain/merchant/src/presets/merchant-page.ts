import {
  ExperienceComponent,
  ExperienceDataMergeType,
  ObjectFit,
} from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { IconTypes } from '@spryker-oryx/ui/icon';

/**
 * Appends the merchant product offers component at the end of the list
 */
export const merchantOffersOnPDP: ExperienceComponent = {
  merge: {
    selector: 'product-info',
    type: ExperienceDataMergeType.Append,
  },
  type: 'oryx-composition',
  components: {
    label: [
      {
        type: 'oryx-content-text',
        content: { data: { text: 'Product offers' } },
        options: { rules: [{ typography: HeadingTag.H4 }] },
      },
    ],
    main: [{ type: 'oryx-merchant-offer-list' }],
  },
  options: {
    rules: [
      {
        hideByRule: 'PRODUCT.!OFFERS',
        layout: {
          type: 'collapsible',
          collapsibleStateKey: 'pdp-merchant-offers',
        },
      },
    ],
  },
};

export const merchantHeaderNavigation: ExperienceComponent = {
  merge: {
    selector: 'category-navigation',
    type: ExperienceDataMergeType.Append,
  },
  type: 'oryx-composition',
  options: { rules: [{ layout: { type: 'dropdown' } }] },
  components: {
    label: [
      {
        type: 'oryx-content-link',
        content: { data: { text: 'Merchants' } },
      },
    ],
    main: [
      {
        type: 'oryx-content-link',
        options: { url: '/merchant/MER000001' },
        content: { data: { text: 'Spryker' } },
      },
      {
        type: 'oryx-content-link',
        options: { url: '/merchant/MER000002' },
        content: { data: { text: 'Video King' } },
      },
      {
        type: 'oryx-content-link',
        options: { url: '/merchant/MER000005' },
        content: { data: { text: 'Budget Cameras' } },
      },
      {
        type: 'oryx-content-link',
        options: { url: '/merchant/MER000006' },
        content: { data: { text: 'Sony Experts' } },
      },
    ],
  },
};

export const merchantSoldToOnPDP: ExperienceComponent = {
  merge: {
    selector: 'oryx-product-brand',
    type: ExperienceDataMergeType.After,
  },
  type: 'oryx-data-text',
  options: {
    entity: 'merchant',
    field: 'name',
    link: true,
    prefix: 'Sold by: ',
  },
};

export const merchantPage: ExperienceComponent = {
  id: 'merchant-page-content',
  type: 'oryx-composition',
  options: { rules: [{ layout: { type: 'list' } }] },
  components: [
    {
      type: 'oryx-data-image',
      options: {
        field: 'banner',
        rules: [{ height: '250px', objectFit: ObjectFit.Cover }],
      },
    },
    {
      type: 'oryx-composition',
      options: {
        rules: [{ layout: { type: 'split', columnWidthType: 'main' } }],
      },
      components: [
        {
          type: 'oryx-composition',
          options: { rules: [{ layout: { type: 'list' } }] },
          components: [
            {
              type: 'oryx-data-text',
              options: {
                field: 'name',
                tag: HeadingTag.H1,
              },
            },
            {
              type: 'oryx-data-text',
              options: {
                field: 'description',
              },
            },
            {
              type: 'oryx-data-text',
              options: { field: 'legal.dataPrivacy' },
            },
            {
              type: 'oryx-data-text',
              options: {
                field: 'legal.cancellationPolicy',
              },
            },
            {
              type: 'oryx-data-text',
              options: { field: 'legal.terms' },
            },
            {
              type: 'oryx-data-text',
              options: { field: 'legal.imprint' },
            },
          ],
        },
        {
          type: 'oryx-composition',
          options: { rules: [{ layout: { type: 'list' } }] },
          components: [
            {
              type: 'oryx-data-image',
              name: 'logo',
              options: {
                field: 'logo',
                rules: [{ height: '100px' }],
              },
            },
            { type: 'oryx-merchant-schedule' },
            {
              type: 'oryx-content-text',
              content: {
                data: { text: 'Contact' },
              },
              options: {
                rules: [{ typography: HeadingTag.H3 }],
              },
            },
            {
              type: 'oryx-data-link',
              options: {
                field: 'contact.email',
                icon: IconTypes.Email,
              },
            },
            {
              type: 'oryx-data-link',
              options: {
                field: 'contact.phone',
                icon: IconTypes.Phone,
              },
            },
          ],
        },
      ],
    },
  ],
};
