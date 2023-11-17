import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';

export const HeaderTemplate: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'header',
  components: [
    {
      type: 'oryx-site-navigation-item',
      options: {
        contentBehavior: 'modal',
        label: 'Account',
        icon: IconTypes.User,
        triggerType: 'icon',
      },
      components: [
        { 
          type: 'oryx-picking-user-profile',
          options: {
            rules: [
              { style: '--oryx-icon-color: var(--oryx-color-primary-9)' }
            ]
          }
        }
      ],
    },
  ],
  options: {
    rules: [
      {
        layout: { 
          type: 'flex', 
          sticky: true, 
          zIndex: 1,
          bleed: true,
        },
        height: '66px',
        background: 'var(--oryx-color-neutral-1)',
        padding: '0 24px',
        gap: '12px',
        align: 'center',
        justify: 'flex-end',
        style: 'box-shadow: var(--oryx-elevation-2) var(--oryx-elevation-color-2);'
      },
    ],
  },
};
