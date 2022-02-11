import { getInjector } from '@spryker-oryx/injector';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { Subscription } from 'rxjs';
import { BannerContent } from './banner.model';
import { styles } from './banner.styles';

export class BannerComponent extends LitElement {
  static override styles = styles;

  @property()
  protected uid?: string;

  @property({ type: Object })
  protected content?: BannerContent;

  protected contentSubscription?: Subscription;

  protected experienceContent: InjectionTokensContractMap[] | any;

  override connectedCallback(): void {
    try {
      this.experienceContent = getInjector().inject('FES.Experience');
      if (this.uid) {
        this.contentSubscription = this.experienceContent
          .getContent({ key: this.uid })
          .subscribe((res: any) => {
            if (res.data) {
              this.content = { ...res.data };
            }
          });
      }
    } catch (e) {
      console.error(e);
    }

    super.connectedCallback();
  }

  override disconnectedCallback(): void {
    this.contentSubscription?.unsubscribe();
    super.disconnectedCallback();
  }

  override render(): TemplateResult {
    if (!this.content) {
      return html``;
    }

    const contents = html`
      <img
        src=${ifDefined(this.content.image)}
        alt=${ifDefined(this.content.alt)}
      />
      <div class="overlay">
        <h1 aria-label="title">${this.content?.title}</h1>
        <h2>${this.content?.content}</h2>
      </div>
    `;

    return html`
      ${when(
        this.content?.link,
        () => html`<a
          href=${ifDefined(this.content?.link)}
          target=${ifDefined(this.content?.urlTarget)}
        >
          ${contents}
        </a>`,
        () => html`${contents}`
      )}
    `;
  }
}
