import { ExperienceComponent } from '@spryker-oryx/experience';
import { HeaderTemplate } from './header';

export const HeaderPickingListsTemplate: ExperienceComponent = {
  ...HeaderTemplate,
  id: 'header-picking-lists',
  options: {
    rules: [{ hideByRule: 'USER.!AUTHENTICATED' }],
  },
  components: [
    {
      type: 'oryx-content-text',
      content: {
        data: {
          text: `<h4>PICK LISTS</h4>`,
        },
      },
      options: {
        rules: [{ margin: '0 auto 0 0' }],
      },
    },
    { type: 'oryx-picking-search' },
    ...HeaderTemplate.components!,
  ],
};
