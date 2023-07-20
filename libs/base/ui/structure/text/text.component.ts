import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { TextProperties } from './text.model';
import { textStyles } from './text.styles';

export class TextComponent extends LitElement implements TextProperties {
  static styles = textStyles;

  @property() content?: string;

  protected render(): TemplateResult | void {
    if (!this.content) return;
    const c = this.appendStyleToHeaders(this.content);
    return html`${unsafeHTML(c)}`;
  }

  protected appendStyleToHeaders(htmlString: string): string {
    const headerRegex = /<(\w+)([^>]*)>(.*?)<\/\1>|<(\w+)([^>]*)\/>/gis;

    const modifiedHtmlString = htmlString.replace(
      headerRegex,
      (match, tag, attributes, content) => {
        if (!tag) return match;
        const classes = attributes?.match(/class="(.*?)"/i)?.[1].trim();
        const headerTag = tag.match(/^(h[1-6]|strong|caption|small)$/i)?.[1];
        const headerFromClass = classes?.match(
          /\b(?<!lg-)(?<!md-)(?<!sm-)(h[1-6]|subtitle|caption|small|strong)\b/gi
        )?.[0];
        const headerScreenClass: string[] =
          classes?.match(/\b(lg-|md-|sm-)h[1-6]\b/gi) ?? [];

        if (!headerTag && !headerFromClass && !headerScreenClass.length) {
          return match;
        } else {
          let styleRules: string =
            attributes?.match(/style="(.*?)"/i)?.[1] ?? '';
          if (styleRules && !styleRules.endsWith(';')) styleRules += ';';

          styleRules += this.getStyle(headerFromClass ?? headerTag);

          headerScreenClass.forEach((cls) => {
            const parts = cls.split('-');
            styleRules += this.getStyle(parts[1], parts[0]);
          });

          const style = `style="${styleRules}"`;

          if (!attributes || !/style=/i.test(attributes)) {
            attributes = `${attributes.trim() ?? ''} ${style}`;
          } else {
            attributes = attributes.replace(/style="([^"]*)"/i, style);
          }

          return `<${tag} ${attributes.trim()}>${content}</${tag}>`;
        }
      }
    );
    return modifiedHtmlString;
  }

  protected getStyle(tag: string, screenSize?: string): string {
    if (!tag) return '';
    const size = screenSize ? `-${screenSize}` : '';

    return `
    --_fs${size}: var(--oryx-typography-${tag}-size);
    --_fw${size}: var(--oryx-typography-${tag}-weight);
    --_lh${size}: var(--oryx-typography-${tag}-line);`;
  }
}
