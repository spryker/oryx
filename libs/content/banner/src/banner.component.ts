import { ExperienceService } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue, observe } from '@spryker-oryx/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { defer, of, ReplaySubject, switchMap } from 'rxjs';
import { BannerContent } from './banner.model';
import { styles } from './banner.styles';

export class BannerComponent extends LitElement {
  static override styles = styles;

  @property()
  protected uid?: string;

  @property({ type: Object })
  protected content?: BannerContent;

  @observe()
  protected content$ = new ReplaySubject(1);

  protected experienceContent = resolve(this, ExperienceService, null);

  contentResolver$ = defer(() =>
    this.uid && this.experienceContent
      ? this.experienceContent
          .getContent({ key: this.uid })
          .pipe(switchMap((res: any) => of(res?.data)))
      : this.content$
  );

  override render(): TemplateResult {
    return html` ${asyncValue(
      this.contentResolver$,
      (content: any) => {
        const contents = html`
          <img src=${ifDefined(content.image)} alt=${ifDefined(content.alt)} />
          <div class="overlay">
            <h1 aria-label="title">${content?.title}</h1>
            <h2>${content?.content}</h2>
          </div>
        `;
        return html` ${when(
          content?.link,
          () => html`<a
            href=${ifDefined(content?.link)}
            target=${ifDefined(content?.urlTarget)}
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
