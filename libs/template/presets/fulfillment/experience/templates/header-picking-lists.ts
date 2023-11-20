import { ExperienceComponent } from '@spryker-oryx/experience';
import { HeaderTemplate } from './header';
import { i18n } from '@spryker-oryx/utilities';

export const HeaderPickingListsTemplate: ExperienceComponent = {
  ...HeaderTemplate,
  id: 'header-picking-lists',
  components: [
    {
      type: 'oryx-content-text',
      content: {
        data: {
          text: `<h4>${i18n('picking.picking-lists')}</h4>`,
        },
      },
      options: { rules: [{ style: 'flex: 1 0 auto; text-transform: uppercase;' }] },
    },
    { type: 'oryx-picking-search' },
   ...HeaderTemplate.components!,
  ],
  // options: {
  //   rules: [
  //     {
  //       layout: {
  //         type: 'flex',
  //         sticky: true,
  //         zIndex: 1,
  //         bleed: true,
  //       },
  //       height: '66px',
  //       background: 'var(--oryx-color-neutral-1)',
  //       padding: '0 24px',
  //       gap: '12px',
  //       align: 'center',
  //       justify: 'flex-end',
  //       style:
  //         'box-shadow: var(--oryx-elevation-2) var(--oryx-elevation-color-2); box-sizing: border-box;',
  //     },
  //   ],
  // },
};
