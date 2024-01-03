import { ExperienceComponent } from '@spryker-oryx/experience';
import { HeaderTemplate } from './header';

export const HeaderPickerTemplate: ExperienceComponent = {
  ...HeaderTemplate,
  id: 'header-picker',
  components: [
    { type: 'oryx-picking-discard-modal' },
    {
      type: 'oryx-picking-order-reference',
      options: { rules: [{ style: 'flex: 1 0 auto;' }] },
    },
    { type: 'oryx-picking-customer-note-modal' },
    ...(HeaderTemplate.components as ExperienceComponent[]),
  ],
};
