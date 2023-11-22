import { ExperienceComponent, ShadowElevation } from '@spryker-oryx/experience';
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
        rules: [{ style: '--oryx-icon-color: var(--oryx-color-primary-9)' }],
      },
      components: [{ type: 'oryx-picking-user-profile' }],
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
        shadow: ShadowElevation.Hovering,
        height: '66px',
        background: 'var(--oryx-color-neutral-1)',
        padding: '0 24px',
        gap: '12px',
        align: 'center',
        justify: 'end',
        style: 'box-sizing: border-box;',
      },
    ],
  },
};
