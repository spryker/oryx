import { LitRouter, RouteConfig } from '@spryker-oryx/router/lit';
import { LitElement, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import { styles } from './fulfillment-root.styles';

export class FulfillmentRootComponent extends LitElement {
  static styles = styles;

  @property({ type: Array }) declare extraRoutes?: RouteConfig[];

  router = new LitRouter(this, this.extraRoutes ?? []);

  protected override render(): unknown {
    return this.router.outlet();
  }

  protected willUpdate(
    changedProps: PropertyValueMap<FulfillmentRootComponent>
  ): void {
    if (
      changedProps.has('extraRoutes') &&
      changedProps.get('extraRoutes') !== this.extraRoutes &&
      this.extraRoutes
    ) {
      // Remove old routes
      changedProps.get('extraRoutes')?.forEach((oldRoute) => {
        const idx = this.router.routes.indexOf(oldRoute);
        if (idx !== -1) this.router.routes.splice(idx, 1);
      });

      // Add new routes
      this.router.routes.push(...this.extraRoutes);
    }
  }
}

export default FulfillmentRootComponent;
