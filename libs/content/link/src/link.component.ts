import {
  ContentComponentProperties,
  ContentController,
} from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { SemanticLinkService } from '@spryker-oryx/site';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { combineLatest, of, switchMap } from 'rxjs';
import { LinkOptions, LinkType } from './link.model';
import { styles } from './link.styles';

export class ContentLinkComponent
  extends LitElement
  implements ContentComponentProperties<LinkOptions>
{
  static styles = styles;

  @property() uid?: string;
  @property({ type: Boolean, reflect: true }) disabled?: boolean;
  @property({ type: Object, reflect: true }) options?: LinkOptions;

  protected contentController = new ContentController(this);
  protected semanticLinkService = resolve(SemanticLinkService);
  protected options$ = this.contentController.getOptions();

  protected data$ = this.options$.pipe(
    switchMap((options) => {
      return combineLatest([
        of(options),
        ...(!options.id || !options.type || options.type === LinkType.RawUrl
          ? [of(options.id)]
          : [
              this.semanticLinkService.get({
                type: options.type,
                id: options.id,
              }),
            ]),
      ]);
    })
  );

  protected getRel(options: LinkOptions): string | null {
    const rel: string[] = [];
    if (options.noopener) {
      rel.push('noopener');
    }
    if (options.nofollow) {
      rel.push('nofollow');
    }
    return rel.length ? rel.join(' ') : null;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.data$, ([options, link]) => {
      return html`<oryx-link .icon=${ifDefined(options.icon?.trim() || null)}>
        ${when(
          link,
          () => html`<a
            href="${link}"
            aria-label=${ifDefined(options.label)}
            target=${ifDefined(options.target)}
            rel=${ifDefined(this.getRel(options))}
            ><slot>${options.text}</slot></a
          >`
        )}
      </oryx-link>`;
    })}`;
  }
}
