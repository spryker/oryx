import { ExperienceComponent } from '@spryker-oryx/experience';
import { i18n } from '@spryker-oryx/utilities';
import { HeaderTemplate } from './header';

export const HeaderPickingListsTemplate: ExperienceComponent = {
  ...HeaderTemplate,
  id: 'header-picking-lists',
  components: [
    {
      type: 'oryx-content-text',
      content: {
        data: {
          text: `<h4>${i18n('picking.pick-lists')}</h4>`,
        },
      },
      options: {
        rules: [{ style: 'flex: 1 0 auto; text-transform: uppercase;' }],
      },
    },
    { type: 'oryx-picking-search' },
    ...HeaderTemplate.components!,
  ],
};
