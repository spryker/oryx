import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { LitElement, TemplateResult } from 'lit';
import { TextMixin } from './text.mixin';
import {
  ContentTextContent,
  ContentTextOptions,
  TextAttributes,
} from './text.model';
import { contentTextStyles } from './text.styles';

import { property } from 'lit/decorators.js';

@defaultOptions({ autoInstallFont: true })
export class ContentTextComponent
  extends TextMixin(
    ContentMixin<ContentTextOptions, ContentTextContent>(LitElement)
  )
  implements TextAttributes
{
  static styles = contentTextStyles;

  @property({ reflect: true }) overflow?: 'clamp' | 'fade';
  @property({ type: Boolean, reflect: true }) toggle?: boolean;

  protected override render(): TemplateResult | void {
    return this.renderText();
  }
}
