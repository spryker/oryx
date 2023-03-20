import { ContextController } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { LitRouter } from '@spryker-oryx/router/lit';
import { asyncValue, hydratable, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { DirectionalityController } from './directionality.controller';
import { styles } from './root-app.styles';

@hydratable()
export class RootAppComponent extends LitElement {
  static styles = styles;

  protected context = new ContextController(this);

  @subscribe()
  protected dirSetup = new DirectionalityController(this).install();

  protected routerService = resolve(RouterService);
  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        // TODO: will be fixed when another solution will be found. Uses as a trigger for dropping hydration
        this.routerService.currentParams(),
        () => html` <experience-composition
            uid="header"
          ></experience-composition>
          ${this.router.outlet()}
          <experience-composition uid="footer"></experience-composition>`
      )}
    `;
  }
}
