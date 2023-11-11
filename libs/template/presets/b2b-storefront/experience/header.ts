import { ExperienceComponent } from '@spryker-oryx/experience';
import { featureVersion } from '@spryker-oryx/utilities';
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
    ...(featureVersion >= '1.3' ? categoryNavigation('35,38') : []),
  ],
};
