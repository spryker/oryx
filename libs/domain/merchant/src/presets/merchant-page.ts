import { ExperienceComponent } from '@spryker-oryx/experience';

export const merchantPage: ExperienceComponent = {
  id: 'merchant-page-content',
  type: 'oryx-composition',
  options: {
    rules: [{ layout: { type: 'split', columnWidthType: 'main' } }],
  },
  components: [
    {},
    {
      type: 'oryx-merchant-opening-hours',
    },
  ],
};
