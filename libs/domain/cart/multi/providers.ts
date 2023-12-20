import { Provider } from '@spryker-oryx/di';
import { provideExperienceData } from '@spryker-oryx/experience';
import { cartsPage } from './presets';

export const multiCartsProviders: Provider[] = [
  provideExperienceData(cartsPage),
];
