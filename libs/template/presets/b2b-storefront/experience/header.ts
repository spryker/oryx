import { ExperienceComponent } from '@spryker-oryx/experience';
import {
  categoryNavigation,
  mainHeader,
  topHeader,
} from '../../storefront/experience/header';

export const HeaderTemplate: ExperienceComponent = {
  id: 'header',
  type: 'oryx-composition',
  components: [
    ...topHeader({ priceModeSelector: true }),
    ...mainHeader(),
    ...categoryNavigation(['2', '11', '23', '31']),
  ],
};
