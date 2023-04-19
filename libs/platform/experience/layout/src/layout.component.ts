import { hydratable, signalAware, ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { LayoutMixin } from './layout.mixin';
import { LayoutAttributes } from './layout.model';
import { styles } from './styles/base.styles';

@ssrShim('style')
@hydratable()
@signalAware()
export class LayoutComponent
  extends LayoutMixin(LitElement)
  implements LayoutAttributes
{
  static styles = styles;

  // @signalProperty({ reflect: true }) layout?: CompositionLayout;
  // @signalProperty({ reflect: true, attribute: 'layout-sm' })
  // layoutSm?: CompositionLayout;
  // @signalProperty({ reflect: true, attribute: 'layout-md' })
  // layoutMd?: CompositionLayout;
  // @signalProperty({ reflect: true, attribute: 'layout-lg' })
  // layoutLg?: CompositionLayout;

  // @property({ reflect: true, type: Boolean, attribute: 'bleed-out' })
  // bleed?: boolean;
  // @property({ reflect: true, type: Boolean }) sticky?: boolean;

  // @property({ reflect: true }) orientation?: CompositionLayoutOrientation;
  // @property({ reflect: true, type: Boolean }) vertical?: boolean;

  // protected layoutBuilder = resolve(LayoutBuilder);
  // protected layoutService = resolve(LayoutService);

  // protected layoutStyles = computed(() => {
  //   const layouts: { [key: string]: CompositionLayout } = {};
  //   if (this.layoutSm) layouts.sm = this.layoutSm;
  //   if (this.layoutMd) layouts.md = this.layoutMd;
  //   if (this.layoutLg) layouts.lg = this.layoutLg;

  //   return this.layoutService.getStyles({});
  // });

  protected override render(): TemplateResult {
    return html`${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}<slot
      ></slot>`;
  }
}
