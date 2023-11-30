import { componentDef } from '@spryker-oryx/utilities';

export const userNavigationTriggerComponent = componentDef({
  name: 'oryx-user-navigation-trigger',
  impl: () =>
    import('./navigation-trigger.component.js').then(
      (m) => m.UserNavigationTriggerComponent
    ),
});
