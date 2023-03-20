import { resolve } from '@spryker-oryx/di';
import { ContentController, ContentMixin } from '@spryker-oryx/experience';
import { SemanticLinkService } from '@spryker-oryx/site';
import { asyncValue } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { combineLatest, of, switchMap } from 'rxjs';
import { ContentLinkOptions, LinkType } from './link.model';
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
        ...(!options.type || options.type === LinkType.RawUrl
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

  protected getRel(options: ContentLinkOptions): string | null {
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
    const { disabled, icon, multiLine, transparent } =
      this.componentOptions ?? {};
    return html`${asyncValue(this.data$, ([options, link]) => {
      if (!link) {
        return html``;
      }

      if (options.button) {
        return html`<oryx-button
          part="wrapper"
          icon="${ifDefined(icon?.trim())}"
        >
          ${this.renderLink(link, options)}
        </oryx-button>`;
      }

      return html`<oryx-link
        icon="${ifDefined(icon?.trim())}"
        ?disabled=${disabled}
        ?multiLine=${multiLine}
        ?transparent=${transparent}
      >
        ${this.renderLink(link, options)}
      </oryx-link>`;
    })}`;
  }
}
