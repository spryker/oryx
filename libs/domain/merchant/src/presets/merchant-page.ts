import { ExperienceComponent, ObjectFit } from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';

export const merchantPage: ExperienceComponent = {
  id: 'merchant-page-content',
  type: 'oryx-composition',
  options: { rules: [{ layout: { type: 'list' } }] },
  components: [
    {
      type: 'oryx-entity-image',
      options: {
        entity: 'merchant',
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
              type: 'oryx-entity-text',
              options: {
                entity: 'merchant',
                field: 'name',
                tag: HeadingTag.H1,
              },
            },
            {
              type: 'oryx-entity-text',
              options: {
                entity: 'merchant',
                field: 'description',
              },
            },
            {
              type: 'oryx-entity-text',
              options: { entity: 'merchant', field: 'legal.dataPrivacy' },
            },
            {
              type: 'oryx-entity-text',
              options: {
                entity: 'merchant',
                field: 'legal.cancellationPolicy',
              },
            },
            {
              type: 'oryx-entity-text',
              options: { entity: 'merchant', field: 'legal.terms' },
            },
            {
              type: 'oryx-entity-text',
              options: { entity: 'merchant', field: 'legal.imprint' },
            },
          ],
        },
        {
          type: 'oryx-composition',
          options: { rules: [{ layout: { type: 'list' } }] },
          components: [
            {
              type: 'oryx-entity-image',
              options: {
                entity: 'merchant',
                field: 'logo',
                rules: [{ height: '100px' }],
              },
            },
            { type: 'oryx-merchant-schedule' },
          ],
        },
      ],
    },
  ],
};
