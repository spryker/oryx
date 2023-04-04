import { resolve } from '@spryker-oryx/di';
import { ContentController, ContentMixin } from '@spryker-oryx/experience';
import { SemanticLinkService } from '@spryker-oryx/site';
import { asyncValue } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { combineLatest, of, switchMap } from 'rxjs';
import { ContentLinkOptions, ContentLinkType } from './link.model';
import { styles } from './link.styles';

export class ContentLinkComponent extends ContentMixin<ContentLinkOptions>(
  LitElement
) {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected semanticLinkService = resolve(SemanticLinkService);
  protected options$ = this.contentController.getOptions();

  protected data$ = this.options$.pipe(
    switchMap((options) => {
      return combineLatest([
        this.options$,
        ...(!options.type || options.type === ContentLinkType.RawUrl
          ? [of(options.id)]
          : [
              this.semanticLinkService.get({
                type: options.type,
                id: options.id,
                params: options.params,
              }),
            ]),
      ]);
    })
  );

  protected getRel(options: ContentLinkOptions): string | undefined {
    return [options?.noopener && 'noopener', options?.nofollow && 'nofollow']
      .filter((rel) => !!rel)
      .join(' ');
  }

  protected renderLink(
    link: string,
    options: ContentLinkOptions
  ): TemplateResult {
    return html`
      <a
        part="link"
        href="${link}"
        aria-label="${ifDefined(options.label)}"
        target="${ifDefined(options.target)}"
        rel="${ifDefined(this.getRel(options))}"
        ?disabled=${options?.disabled}
        ><slot>${options?.text}</slot></a
      >
    `;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.data$, ([options, link]) => {
      const { disabled, loading, icon, multiLine, linkType } =
        this.componentOptions ?? {};

      if (!link) {
        return html``;
      }

      if (options.button) {
        return html`<oryx-button
          part="wrapper"
          .icon=${icon}
          ?loading=${loading}
        >
          ${this.renderLink(link, options)}
        </oryx-button>`;
      }

      return html`<oryx-link
        .icon=${icon}
        ?disabled=${disabled}
        ?multiLine=${multiLine}
        .linkType=${linkType}
      >
        ${this.renderLink(link, options)}
      </oryx-link>`;
    })}`;
  }
}
