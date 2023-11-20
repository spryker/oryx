import { ExperienceComponent } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';

export const HeaderTemplate: ExperienceComponent = {
  type: 'oryx-composition',
  id: 'header',
  components: [
    {
      type: 'oryx-site-navigation-item',
      options: {
        contentBehavior: 'modal',
        label: i18n('picking.account'),
        icon: IconTypes.User,
        triggerType: 'icon',
        rules: [{ style: '--oryx-icon-color: var(--oryx-color-primary-9)' }],
      },
      components: [
        {
          type: 'oryx-picking-user-profile',
        },
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
        justify: 'end',
        style:
          'box-shadow: var(--oryx-elevation-2) var(--oryx-elevation-color-2); box-sizing: border-box;',
      },
    ],
  },
};
