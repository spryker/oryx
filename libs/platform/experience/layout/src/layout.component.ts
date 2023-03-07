import { resolve } from '@spryker-oryx/di';
import { ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  CompositionLayout,
  CompositionLayoutOrientation,
  StyleRuleSet,
} from '../../src/models';
import { LayoutBuilder } from '../../src/services';
import { LayoutAttributes } from './layout.model';
import { layoutStyles } from './layout.styles';

@ssrShim('style')
export class LayoutComponent extends LitElement implements LayoutAttributes {
  static styles = layoutStyles;

  @property({ reflect: true }) layout?: CompositionLayout;
  @property({ reflect: true }) orientation?: CompositionLayoutOrientation;
  @property({ reflect: true, type: Boolean }) sticky?: boolean;
  @property({ reflect: true, type: Boolean }) vertical?: boolean;
  @property({ reflect: true, type: Boolean }) container?: boolean;
  @property({ reflect: true, type: Boolean }) maxWidth?: boolean;

  @state()
  layoutStyles: string | undefined;

  @property() set rules(rules: StyleRuleSet[] | undefined) {
    const rule = rules?.[0];
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

      this.layoutStyles = this.layoutBuilder.getLayoutStyles(rule);
    } else {
      this.layout = undefined;
      this.orientation = undefined;
      this.sticky = undefined;
      this.container = undefined;
      this.maxWidth = undefined;
      this.layoutStyles = undefined;
    }
  }

  protected layoutBuilder = resolve(LayoutBuilder);

  protected override render(): TemplateResult {
    return html`
      <slot></slot>
      ${this.layoutStyles
        ? html`${unsafeHTML(`<style>:host {
          ${this.layoutStyles}
        }
        </style>`)}`
        : html``}
    `;
  }
}
