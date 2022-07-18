import { ComponentsRegistryService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { LitElement } from 'lit';

export function initHydrateHooks() {
  const registryService = resolve(ComponentsRegistryService);

  //TODO - remove this when we no longer need manual hydrate on demand
  globalThis.hydrateOnDemand =
    registryService.hydrateOnDemand.bind(registryService);

  globalThis.treewalk('[hydratable]').forEach((el) => {
    const modes = el.getAttribute('hydratable')?.split?.(',');
    for (let i = 0; i < modes.length; i++) {
      const parts = modes[i].split(':');
      const mode = parts[parts.length - 1];
      let target = el;
      if (parts.length > 1) {
        target = parts[0] === 'window' ? window : el;
      }
      target.addEventListener(mode, () => registryService.hydrateOnDemand(el));
    }
  });

  const storefront = document.body.querySelector('storefront-component');
  registryService.hydrateOnDemand(storefront as LitElement);
}
