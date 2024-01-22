import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { signal, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, css, html, isServer } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { JsonLdService } from '../src/services';
import { JsonLdComponentOptions } from './jsonld.model';

@defaultOptions({ serverOnly: true })
@signalAware()
export class SiteJsonLdComponent extends ContentMixin<JsonLdComponentOptions>(
  LitElement
) {
  static styles = css`
    :host {
      display: contents;
    }
  `;

  protected jsonLdService = resolve(JsonLdService);

  protected $schemas = signal(this.jsonLdService.getSchemas());

  protected override render(): TemplateResult | void {
    if (this.$options().serverOnly && !isServer) return;

    const schemas = this.$schemas();
    if (!schemas?.length) return;

    return html`${unsafeHTML(`
      <script type="application/ld+json">
        ${JSON.stringify(schemas)}
      </script>
    `)}`;
  }
}
