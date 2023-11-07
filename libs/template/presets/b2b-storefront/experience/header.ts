import { ExperienceComponent } from '@spryker-oryx/experience';
import { mainHeader, topHeader } from '../../storefront/experience/header';

export const HeaderTemplate: ExperienceComponent = {
  id: 'header',
  type: 'Page',
  meta: { title: 'Header', route: '/_header' },
  components: [...topHeader({ priceModeSelector: true }), ...mainHeader()],
};
