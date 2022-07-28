import { hydratable } from '@spryker-oryx/core';
import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { combineLatest } from 'rxjs';
import { BannerContent, BannerOptions } from './banner.model';
import { styles } from './banner.styles';

@hydratable('click')
export class BannerComponent extends ComponentMixin<
  BannerContent,
  BannerOptions
>() {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected content$ = this.contentController.getContent();
  protected options$ = this.contentController.getOptions();

  protected data$ = combineLatest([this.content$, this.options$]);

  override render(): TemplateResult {
    return html`${asyncValue(
      this.data$,
      ([content, options]) => {
        const contents = html`
          <img src=${ifDefined(content?.image)} alt=${ifDefined(options.alt)} />
          <div class="overlay">
            ${when(
              content?.title,
              () => html`<h1 aria-label="title">${content?.title}</h1>`
            )}
            ${when(content?.content, () => html`<h2>${content?.content}</h2>`)}
          </div>
        `;
        return html` ${when(
          options.link,
          () => html`<a
            href=${ifDefined(options.link)}
            target=${ifDefined(options.urlTarget)}
            aria-label=${ifDefined(options.linkLabel)}
          >
            ${contents}
          </a>`,
          () => html`${contents}`
        )}`;
      },
      () => html``
    )}`;
  }
}
