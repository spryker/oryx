import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { SemanticLinkService } from '@spryker-oryx/site';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { combineLatest, of, switchMap } from 'rxjs';
import { ContentLinkOptions, LinkType } from './link.model';

export class ContentLinkComponent extends ComponentMixin<ContentLinkOptions>() {
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
    return html`${asyncValue(this.data$, ([options, link]) => {
      if (!link) {
        return html``;
      }

      if (options.button) {
        return html`<oryx-button
          part="wrapper"
          icon="${ifDefined(options.icon?.trim())}"
        >
          ${this.renderLink(link, options)}
        </oryx-button>`;
      }

      return html`<oryx-link
        part="wrapper"
        icon="${ifDefined(options.icon?.trim())}"
        ?disabled=${options?.disabled}
      >
        ${this.renderLink(link, options)}
      </oryx-link>`;
    })}`;
  }
}
