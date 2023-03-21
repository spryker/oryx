import { ContextController } from '@spryker-oryx/core';
import { LitRouter } from '@spryker-oryx/router/lit';
import { hydratable, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { DirectionalityController } from './directionality.controller';
import { styles } from './root-app.styles';

@hydratable()
export class RootAppComponent extends LitElement {
  static styles = styles;

  protected context = new ContextController(this);

  @subscribe()
  protected dirSetup = new DirectionalityController(this).install();

  protected router = new LitRouter(this, []);

  protected override render(): TemplateResult {
    return html`
      <experience-composition uid="header"></experience-composition>
      ${this.router.outlet()}
      <experience-composition uid="footer"></experience-composition>
    `;
  }
}
