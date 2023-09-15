import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { LinkService } from '@spryker-oryx/site';
import { computed, signalAware } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { of } from 'rxjs';
import {
  DropdownItemContent,
  DropdownItemOptions,
} from './dropdown-item.model';
import { styles } from './dropdown-item.styles';

@signalAware()
export class DropdownItemComponent extends ContentMixin<
  DropdownItemOptions,
  DropdownItemContent
>(LitElement) {
  static styles = styles;

  protected linkService = resolve(LinkService);
  protected $url = computed(() => {
    const url = this.$options().url;
    return typeof url !== 'object' ? of(url) : this.linkService.get(url);
  });

  protected override render(): TemplateResult {
    const { url, icon } = this.$options();
    const { text } = this.$content() ?? {};
    return html`<oryx-dropdown-item
      .text=${text}
      .url=${this.$url()}
      .icon=${icon}
    ></oryx-dropdown-item>`;
  }
}
