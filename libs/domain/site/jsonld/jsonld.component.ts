import { resolve } from '@spryker-oryx/di';
import { signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, css, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { JsonLdService } from '../src/services';

@signalAware()
export class SiteJsonLdComponent extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
  `;

  protected jsonLdService = resolve(JsonLdService);

  protected $schemas = signal(this.jsonLdService.getSchemas());

  protected override render(): TemplateResult | void {
    const schemas = this.$schemas();
    if (!schemas?.length) return;

    return html`${unsafeHTML(`
      <script type="application/ld+json">
        ${JSON.stringify(schemas)}
      </script>
    `)}`;
  }
}
