import { hydratable } from '@spryker-oryx/core';
import { ExperienceService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import {
  BehaviorSubject,
  combineLatest,
  defer,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { BannerContent, BannerOptions } from './banner.model';
import { styles } from './banner.styles';

@hydratable('click')
export class BannerComponent extends LitElement {
  static override styles = styles;

  @property()
  protected uid?: string;

  @property({ type: Object })
  protected content?: BannerContent;

  @property({ type: Object })
  protected options?: BannerOptions;

  @observe()
  protected content$ = new BehaviorSubject(this.content);

  @observe()
  protected options$ = new BehaviorSubject(this.options);

  protected experienceContent = resolve(ExperienceService, null);

  protected contentResolver$: Observable<BannerContent> = defer(() =>
    this.uid && this.experienceContent
      ? this.experienceContent
          .getContent({ uid: this.uid })
          .pipe(switchMap((res: any) => of(res?.data)))
      : this.content$
  );

  protected optionsResolver$: Observable<BannerOptions> = defer(() =>
    this.uid && this.experienceContent
      ? this.experienceContent
          .getOptions({ uid: this.uid })
          .pipe(switchMap((res: any) => of(res?.data)))
      : this.options$
  );

  protected data$ = combineLatest([
    this.contentResolver$,
    this.optionsResolver$,
  ]);

  override render(): TemplateResult {
    return html`${asyncValue(
      this.data$,
      ([content, options]) => {
        const contents = html`
          <img
            src=${ifDefined(content?.image)}
            alt=${ifDefined(options?.alt)}
          />
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
