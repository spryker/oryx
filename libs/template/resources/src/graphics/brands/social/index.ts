import { ResourceGraphic } from '@spryker-oryx/experience';

export const socialLogos: ResourceGraphic = {
  instagram: { source: () => import('./instagram').then((m) => m.resource) },
  youtube: { source: () => import('./youtube').then((m) => m.resource) },
  facebook: { source: () => import('./facebook').then((m) => m.resource) },
  pinterest: { source: () => import('./pinterest').then((m) => m.resource) },
};
