import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { LitRouter } from '@spryker-oryx/router/lit';
import { asyncValue, hydratable } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { styles } from './root-app.styles';

@hydratable()
export class RootAppComponent extends LitElement {
  protected context = new ContextController(this);
  protected routerService = resolve(RouterService);
  private _router = new LitRouter(this, []);

  static styles = styles;

  protected route$ = this.routerService.currentParams();

  override render(): TemplateResult {
    return html` ${asyncValue(
      this.route$,
      () =>
        html`<experience-composition uid="header"></experience-composition>
          ${this._router.outlet()}
          <experience-composition uid="footer"></experience-composition>`
    )}`;
  }
}
