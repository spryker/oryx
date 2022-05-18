// organize-imports-ignore
import './bootstrap-injector';
import './experience-preview';
import '@spryker-oryx/experience/components';
import './storefront.component';
import { ComponentsRegistryService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';

const registryService = resolve(this, ComponentsRegistryService);

//TODO - remove this when we no longer need manual hydrate on demand
globalThis.hydrateOnDemand =
  registryService.hydrateOnDemand.bind(registryService);
