import { LitElement, ReactiveController, TemplateResult, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { renderHeading } from '../heading/src/heading.util';
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

  /**
   * Modifies an HTML string by adding custom inline styles to specific HTML elements
   * based on their tags, classes, and screen sizes. The typography styles align with the
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
          const mergedObject = headerScreenClass.reduce((acc, cls) => {
            const parts = cls.split('-');
            const key = `as${parts[0].charAt(0).toUpperCase()}${parts[0].slice(
              1
            )}`;
            return { ...acc, [key]: parts[1] };
          }, {});

          return `${renderHeading(
            content,
            { tag, ...mergedObject },
            attributes
          )}`;
        }
      }
    );
    return modifiedHtmlString;
  }
}
