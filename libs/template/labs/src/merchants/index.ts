import { Provider } from '@spryker-oryx/di';
import {
  ExperienceComponent,
  ExperienceDataMergeType,
  provideExperienceData,
} from '@spryker-oryx/experience';

const merchantBannersData: ExperienceComponent = {
  merge: {
    selector: 'brands',
    type: ExperienceDataMergeType.After,
  },
  type: 'oryx-composition',
  components: [
    {
      type: 'oryx-data-list',
      options: {
        entity: 'merchant',
        link: true,
        rules: [
          {
            layout: { type: 'grid' },
            padding: '10px',
            background: 'var(--oryx-color-neutral-5)',
          },
        ],
      },
      components: [
        { type: 'oryx-data-image', options: { field: 'banner' } },
        { type: 'oryx-data-text', options: { field: 'name' } },
      ],
    },
  ],

  options: {
    rules: [{ layout: { type: 'split' } }],
  },
};

export const merchantBanners: Provider = provideExperienceData([
  merchantBannersData,
]);
