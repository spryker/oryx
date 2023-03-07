import { resolve } from '@spryker-oryx/di';
import { asyncValue, ssrShim, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { tap } from 'rxjs';
import { ContentController } from '../../src/controllers';
import { ContentMixin } from '../../src/mixins';
import {
  CompositionLayout,
  CompositionLayoutOrientation,
  CompositionProperties,
  StyleRuleSet,
} from '../../src/models';
import { LayoutBuilder } from '../../src/services';
import { LayoutAttributes } from './layout.model';
import { layoutStyles } from './layout.styles';

@ssrShim('style')
export class LayoutComponent
  extends ContentMixin<CompositionProperties>(LitElement)
  implements LayoutAttributes
{
  static styles = layoutStyles;

  @property({ reflect: true }) layout?: CompositionLayout;
  @property({ reflect: true }) orientation?: CompositionLayoutOrientation;
  @property({ reflect: true, type: Boolean }) sticky?: boolean;
  @property({ reflect: true, type: Boolean }) vertical?: boolean;
  @property({ reflect: true, type: Boolean }) container?: boolean;
  @property({ reflect: true, type: Boolean }) maxWidth?: boolean;

  protected layoutBuilder = resolve(LayoutBuilder);

  @subscribe()
  protected options$ = new ContentController(this).getOptions().pipe(
    tap((options) => {
      const rule = this.getRule(options);
      if (rule) {
        if (rule.layout) {
          this.layout = rule.layout;
        }

        if (rule.orientation) {
          this.orientation = rule.orientation;
        }

        this.sticky = !!rule?.sticky;
        this.container = !!rule?.container;
        this.maxWidth = !!rule?.maxWidth;
      } else {
        this.layout = undefined;
        this.orientation = undefined;
        this.sticky = undefined;
        this.container = undefined;
        this.maxWidth = undefined;
      }
    })
  );

  protected override render(): TemplateResult {
    return html`
      <slot></slot>
      ${asyncValue(this.options$, (options) => {
        const rules = this.layoutBuilder.getLayoutStyles(options?.rules?.[0]);
        return rules
          ? html`${unsafeHTML(`<style>:host {
          ${rules}
        }
        </style>`)}`
          : html``;
      })}
    `;
  }

  protected getRule(options: CompositionProperties): StyleRuleSet | undefined {
    return options.rules?.[0];
  }
}
