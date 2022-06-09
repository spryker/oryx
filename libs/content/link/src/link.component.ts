import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LinkContent } from './link.model';
import { styles } from './link.styles';

export class ContentLinkComponent extends LitElement {
  static styles = styles;

  @property() uid?: string;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ type: Object }) content?: LinkContent;

  protected content$ = new ContentController<LinkContent>(this).content$;

  protected getRel(content: LinkContent): string | null {
    const rel: string[] = [];
    if (content?.noopener) {
      rel.push('noopener');
    }
    if (content?.nofollow) {
      rel.push('nofollow');
    }
    return rel.length ? rel.join(' ') : null;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.content$, (content) => {
      return html`<oryx-link .icon=${content?.icon}>
        <a
          href=${content?.href}
          target=${ifDefined(content?.target)}
          rel=${ifDefined(this.getRel(content))}
          >${content?.text}</a
        >
      </oryx-link>`;
    })}`;
  }
}
