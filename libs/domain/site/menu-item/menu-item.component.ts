import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { LinkService } from '@spryker-oryx/site';
import { ButtonType } from '@spryker-oryx/ui/button';
import { computed } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { map } from 'rxjs';
import { SiteMenuItemContent, SiteMenuItemOptions } from './menu-item.model';
import { styles } from './menu-item.styles';

export class MenuItemComponent extends ContentMixin<
  SiteMenuItemOptions,
  SiteMenuItemContent
>(LitElement) {
  static styles = styles;

  protected linkService = resolve(LinkService);
  protected routerService = resolve(RouterService);

  protected $link = computed(() => {
    const { url, type, id } = this.$options();
    if (url) return url;
    if (type) return this.linkService.get({ type, id });
    return null;
  });

  protected $active = computed(() => {
    return this.routerService
      .route()
      .pipe(map((route) => route === this.$link()));
  });

  protected override render(): TemplateResult {
    const { icon } = this.$options();
    return html`<oryx-button
      class=${ifDefined(this.$active() ? 'active' : '')}
      .type="${ButtonType.Text}"
      .text=${this.$content()?.text}
      .icon=${icon}
      href=${ifDefined(this.$link())}
    ></oryx-button>`;
  }
}
