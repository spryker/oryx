import { componentDef } from '@spryker-oryx/core';

export * from './collapsible.component';
export * from './collapsible.model';
export * from './styles';

export const collapsibleComponent = componentDef({
  name: 'oryx-collapsible',
  impl: () =>
    import('./collapsible.component').then((m) => m.CollapsibleComponent),
});
