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

  /**
   * Modifies an HTML string by adding custom inline styles to specific HTML elements
   * based on their tags, classes, and screen sizes. The styles align roughly with the
   * Oryx design system without reusing the design system components directly.
   *
   * @param htmlString - The HTML string to be modified.
   * @returns The modified HTML string with custom inline styles.
   */
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

          styleRules += this.getHeaderStyle(headerFromClass ?? headerTag);

          headerScreenClass.forEach((cls) => {
            const parts = cls.split('-');
            styleRules += this.getHeaderStyle(parts[1], parts[0]);
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

  /**
   * Generates custom inline styles for a given HTML tag representing a header and, optionally, a screen size prefix for responsive styles.
   *
   * @param headerTag - The HTML tag (e.g., 'h1', 'strong') for which to generate header styles.
   * @param screenSize - (Optional) The screen size prefix for responsive header styles (e.g., 'lg', 'md', 'sm').
   * @returns The custom inline styles for the header as a string.
   */
  protected getHeaderStyle(tag: string, screenSize?: string): string {
    if (!tag) return '';
    const size = screenSize ? `-${screenSize}` : '';

    return `
    --_fs${size}: var(--oryx-typography-${tag}-size);
    --_fw${size}: var(--oryx-typography-${tag}-weight);
    --_lh${size}: var(--oryx-typography-${tag}-line);`;
  }
}
