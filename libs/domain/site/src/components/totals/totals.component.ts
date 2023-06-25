import { TokenResolver } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { computed, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { map, of } from 'rxjs';
import { SiteTotalsOptions } from './totals.model';
import { siteTotalStyles } from './totals.styles';

@hydratable('window:load')
export class SiteTotalsComponent extends ContentMixin<SiteTotalsOptions>(
  LitElement
) {
  static styles = siteTotalStyles;

  protected tokenResolver = resolve(TokenResolver);

  protected $isVisible = computed(() => {
    const { renderIf } = this.$options();
    if (!renderIf) return of(true);
    return this.tokenResolver
      .resolveData(renderIf)
      .pipe(map((result) => !!result));
  });

  protected override render(): TemplateResult | void {
    if (!this.$isVisible()) return;

    const { heading } = this.$options();

    return html`<h2>${heading ?? i18n('site.totals.summary')}</h2>
      <oryx-composition .uid=${this.uid}></oryx-composition>`;
  }
}
