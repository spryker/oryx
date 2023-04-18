import { resolve } from '@spryker-oryx/di';
import {
  computed,
  hydratable,
  signalProperty,
  ssrShim,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { ContentMixin } from '../../src/mixins';
import {
  CompositionLayout,
  CompositionLayoutOrientation,
  CompositionProperties,
} from '../../src/models';
import { LayoutBuilder } from '../../src/services';
import { LayoutAttributes } from './layout.model';
import { LayoutService } from './services';
import { styles } from './styles/base.styles';

@ssrShim('style')
@hydratable()
export class LayoutComponent
  extends ContentMixin<CompositionProperties>(LitElement)
  implements LayoutAttributes
{
  static styles = styles;

  @signalProperty({ reflect: true }) layout?: CompositionLayout;
  @signalProperty({ reflect: true, attribute: 'layout-sm' })
  layoutSm?: CompositionLayout;
  @signalProperty({ reflect: true, attribute: 'layout-md' })
  layoutMd?: CompositionLayout;
  @signalProperty({ reflect: true, attribute: 'layout-lg' })
  layoutLg?: CompositionLayout;

  @property({ reflect: true, type: Boolean, attribute: 'bleed-out' })
  bleed?: boolean;
  @property({ reflect: true, type: Boolean }) sticky?: boolean;

  @property({ reflect: true }) orientation?: CompositionLayoutOrientation;
  @property({ reflect: true, type: Boolean }) vertical?: boolean;

  protected layoutBuilder = resolve(LayoutBuilder);
  protected layoutService = resolve(LayoutService);

  protected layoutStyles = computed(() => {
    const layouts: any = {};
    if (this.layoutSm) layouts.sm = this.layoutSm;
    if (this.layoutMd) layouts.md = this.layoutMd;
    if (this.layoutLg) layouts.lg = this.layoutLg;

    return this.layoutService.getStyles(this.layout, layouts);
  });

  protected override render(): TemplateResult {
    return html`${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}<slot
      ></slot>`;
  }
}
