import {
  ExperienceComponent,
  ExperienceDataMergeType,
  ObjectFit,
} from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { MERCHANT } from '../entity';

/**
 * Appends the merchant product offers component at the end of the list
 */
export const merchantOffersOnPDP: ExperienceComponent = {
  merge: {
    selector: 'product-info',
    type: ExperienceDataMergeType.Append,
  },
  type: 'oryx-merchant-offer-list',
};

export const merchantSoldToOnPDP: ExperienceComponent = {
  merge: {
    selector: 'oryx-product-brand',
    type: ExperienceDataMergeType.After,
  },
  type: 'oryx-data-text',
  options: {
    entity: MERCHANT,
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
        entity: MERCHANT,
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
                entity: MERCHANT,
                field: 'name',
                tag: HeadingTag.H1,
              },
            },
            {
              type: 'oryx-data-text',
              options: {
                entity: MERCHANT,
                field: 'description',
              },
            },
            {
              type: 'oryx-data-text',
              options: { entity: MERCHANT, field: 'legal.dataPrivacy' },
            },
            {
              type: 'oryx-data-text',
              options: {
                entity: MERCHANT,
                field: 'legal.cancellationPolicy',
              },
            },
            {
              type: 'oryx-data-text',
              options: { entity: MERCHANT, field: 'legal.terms' },
            },
            {
              type: 'oryx-data-text',
              options: { entity: MERCHANT, field: 'legal.imprint' },
            },
          ],
        },
        {
          type: 'oryx-composition',
          options: { rules: [{ layout: { type: 'list' } }] },
          components: [
            {
              type: 'oryx-data-image',
              options: {
                entity: MERCHANT,
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
                entity: MERCHANT,
                field: 'contact.email',
                icon: IconTypes.Email,
              },
            },
            {
              type: 'oryx-data-link',
              options: {
                entity: MERCHANT,
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
