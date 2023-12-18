import { ExperienceComponent, ObjectFit } from '@spryker-oryx/experience';

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
          type: 'oryx-entity-text',
          options: {
            entity: 'merchant',
            field: 'name',
          },
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
