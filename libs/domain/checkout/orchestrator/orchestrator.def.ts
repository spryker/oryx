import { componentDef } from '@spryker-oryx/utilities';

export const checkoutOrchestratorComponent = componentDef({
  name: 'oryx-checkout-orchestrator',
  impl: () =>
    import('./orchestrator.component').then(
      (m) => m.CheckoutOrchestratorComponent
    ),
  schema: () =>
    import('./orchestrator.schema').then((m) => m.checkoutOrchestratorSchema),
});
