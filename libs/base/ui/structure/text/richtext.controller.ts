import { LitElement, ReactiveController, TemplateResult, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { TextProperties } from './text.model';

export class RichTextController implements ReactiveController {
  constructor(protected host: LitElement & TextProperties) {
    this.host.addController(this);
  }

  hostConnected?(): void;

  protected _content?: string;

  hostUpdate(): void {
    if (this.host.content) {
      this._content = this.appendStyleToHeaders(this.host.content);
    }
  }

  get richContent(): TemplateResult | void {
    if (!this._content) return;
    return html`${unsafeHTML(this._content)}`;
  }

  private headerRegex = /<(\w+)([^>]*)>(.*?)<\/\1>|<(\w+)([^>]*)\/>/gis;
  private classRegex = /class="(.*?)"/i;
  private tagRegex = /^(h[1-6]|strong|caption|small)$/i;
  private screenClassRegex = /\b(lg-|md-|sm-)h[1-6]\b/gi;
  private fromClassRegex =
    /\b(?<!lg-)(?<!md-)(?<!sm-)(h[1-6]|subtitle|caption|small|strong)\b/gi;
  private styleRegex = /style="(.*?)"/i;
  private styleReplace = /style="([^"]*)"/i;

  /**
   * Modifies an HTML string by adding custom inline styles to specific HTML elements
   * based on their tags, classes, and screen sizes. The styles align roughly with the
   * Oryx design system without reusing the design system components directly.
   *
   * @param htmlString - The HTML string to be modified.
   * @returns The modified HTML string with custom inline styles.
   */
  protected appendStyleToHeaders(htmlString: string): string {
    const modifiedHtmlString = htmlString.replace(
      this.headerRegex,
      (match, tag, attributes, content) => {
        if (!tag) return match;
        const classes = attributes?.match(this.classRegex)?.[1].trim();
        const headerTag = tag.match(this.tagRegex)?.[1];
        const headerFromClass = classes?.match(this.fromClassRegex)?.[0];
        const headerScreenClass: string[] =
          classes?.match(this.screenClassRegex) ?? [];

        if (!headerTag && !headerFromClass && !headerScreenClass.length) {
          return match;
        } else {
          let styleRules: string =
            attributes?.match(this.styleRegex)?.[1] ?? '';
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
            attributes = attributes.replace(this.styleReplace, style);
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
