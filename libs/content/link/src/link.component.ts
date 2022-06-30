import {
  ContentComponentProperties,
  ContentController,
} from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { combineLatest, map } from 'rxjs';
import { LinkContent, LinkOptions } from './link.model';
import { styles } from './link.styles';

export class ContentLinkComponent
  extends LitElement
  implements ContentComponentProperties<LinkContent, LinkOptions>
{
  static styles = styles;

  @property() uid?: string;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ type: Object }) content?: LinkContent;
  @property({ type: Object }) options?: LinkOptions;

  protected contentController = new ContentController(this);
  protected content$ = this.contentController.getContent();
  protected options$ = this.contentController.getOptions();

  protected data$ = combineLatest([this.content$, this.options$]).pipe(
    map(([content, options]) => {
      return {
        content,
        options,
      };
    })
  );

  protected getRel(options?: LinkOptions): string | null {
    const rel: string[] = [];
    if (options?.noopener) {
      rel.push('noopener');
    }
    if (options?.nofollow) {
      rel.push('nofollow');
    }
    return rel.length ? rel.join(' ') : null;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.data$, ({ content, options }) => {
      return html`<oryx-link icon=${ifDefined(content?.icon)}>
        <a
          href=${content?.href}
          target=${ifDefined(options?.target)}
          rel=${ifDefined(this.getRel(options))}
          >${content?.text}</a
        >
      </oryx-link>`;
    })}`;
  }
}
