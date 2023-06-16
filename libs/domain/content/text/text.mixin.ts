import { Type } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { HeadingTag, headingUtil } from '@spryker-oryx/ui/heading';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { FontController } from './font.controller';
import {
  ContentTextContent,
  ContentTextOptions,
  TextAttributes,
} from './text.model';
import { TruncationController } from './truncate.controller';

export declare class TextMixinInterface {
  appearance?: HeadingTag;

  protected renderText(): TemplateResult | void;
  protected renderStyles(): TemplateResult | void;
}

export const TextMixin = <T extends Type<LitElement> & TextAttributes>(
  superClass: T
): Type<TextMixinInterface> & T => {
  class TextMixinClass extends ContentMixin<
    ContentTextOptions,
    ContentTextContent
  >(superClass) {
    @property() appearance?: HeadingTag;

    protected fontController = new FontController(this);
    protected truncationController = new TruncationController(this);

    protected _lines?: number;

    @property() set lines(value: number) {
      this._lines = value;
      this.style.setProperty('--max-lines', value?.toString());
    }

    get lines(): number | undefined {
      return this._lines;
    }

    protected renderText(): TemplateResult | void {
      const text = this.$content()?.text;
      const template = text ? unsafeHTML(text) : html`<slot></slot>`;
      return html`${template}${this.renderStyles()}`;
    }

    protected renderStyles(): TemplateResult | void {
      const styles = this.getStyles();

      if (!styles) return;

      return html`<style>
        ${unsafeHTML(styles)}
      </style>`;
    }

    protected getStyles(): string | void {
      let styles = '';
      [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'b',
        '.caption',
        '.subtitle',
      ].forEach((tag) => {
        const utilTag = tag.split('.').at(-1) as HeadingTag;
        if ((this.appearance as unknown as string) === tag) {
          styles += `:host {\n${headingUtil(utilTag)}}\n`;
        }
        if (this.$content()?.text?.includes(`<${tag}`)) {
          styles += `${tag} {\n${headingUtil(utilTag)}}\n`;
        }
        if (this.querySelector(tag)) {
          styles += `::slotted(${tag}) {\n${headingUtil(utilTag)}}\n`;
        }
      });
      // if (this.$content()?.text?.includes(`<b`)) {
      //   styles += `b {\n${headingUtil(HeadingTag.Button)}}\n`;
      // }
      // if (this.$content()?.text?.includes(`caption`)) {
      //   styles += `.caption {\n${headingUtil(HeadingTag.Caption)}}\n`;
      // }
      // if (this.$content()?.text?.includes(`subtitle`)) {
      //   styles += `.subtitle {\n${headingUtil(HeadingTag.Subtitle)}\n`;
      // }

      return styles;
    }
  }

  // Cast return type to your mixin's interface intersected with the superClass type
  return TextMixinClass as unknown as Type<TextMixinInterface> & T;
};
