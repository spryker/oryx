/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

function noopFactoryDecorator() {
  return () => {};
}

export const HYDRATE_ON_DEMAND = '';
export const HYDRATING = '';

export const hydratable = noopFactoryDecorator;

export class ObserveController {}

export const observe = noopFactoryDecorator;

export const ssrShim = noopFactoryDecorator;

export class SubscribeController {}

export const subscribe = noopFactoryDecorator;
