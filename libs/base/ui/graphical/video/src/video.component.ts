import { hydrate, ssrShim } from '@spryker-oryx/utilities';
import { LitElement, PropertyValues, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { VideoAspectRatio, VideoAttributes, VideoPreload } from './video.model';
import { videoStyles } from './video.styles';

@ssrShim('style')
@hydrate()
export default class VideoComponent
  extends LitElement
  implements VideoAttributes
{
  static styles = [videoStyles];

  @property({ reflect: true }) url?: string;
  @property({ type: Boolean, reflect: true }) autoplay?: boolean;
  @property({ type: Boolean, reflect: true }) controls?: boolean;
  @property({ type: Boolean, reflect: true }) loop?: boolean;
  @property({ type: Boolean, reflect: true }) muted?: boolean;
  @property({ type: Boolean, reflect: true }) playsInline?: boolean;
  @property({ reflect: true }) preload?: VideoPreload;
  @property({ reflect: true }) set aspectRatio(value: VideoAspectRatio) {
    this.style.setProperty('--aspect-ratio', value);
    this.style.setProperty('height', value ? '' : 'var(--height)');
  }

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    const video = this.renderRoot.querySelector<HTMLVideoElement>('video');

    if (video) {
      video.muted = !!this.muted;
    }
  }

  protected override render(): TemplateResult | void {
    if (!this.url) {
      return;
    }

    if (this.isYoutube()) {
      return html`<object
        data=${ifDefined(this.resolveYoutubeUrl())}
      ></object>`;
    } else {
      return html` <video
        ?autoplay=${this.autoplay}
        ?controls=${this.controls}
        ?loop=${this.loop}
        ?muted=${this.muted}
        ?playsInline=${this.playsInline}
        preload=${ifDefined(this.preload)}
      >
        <source src=${ifDefined(this.url)} />
      </video>`;
    }
  }

  protected isYoutube(): boolean {
    return !!this.url && /youtu.be|youtube/g.test(this.url);
  }

  protected resolveYoutubeUrl(): string | undefined {
    if (!this.url) {
      return;
    }

    const resolveId = (url: string): string | undefined => {
      if (url.includes('youtu.be')) {
        return url.split('/').pop();
      } else if (url.includes('youtube.com')) {
        if (url.includes('/embed/')) {
          return url.split('/embed/').pop()?.split('?')[0];
        }

        return new URL(url).searchParams.get('v') ?? undefined;
      }
      return;
    };

    const allowedUrlQueryParams: (keyof VideoComponent)[] = [
      'loop',
      'autoplay',
      'controls',
      'muted',
    ];

    const paramsReplaces: Record<string, string> = {
      muted: 'mute',
    };

    const parseParams = (param: string): string => {
      return paramsReplaces[param] ?? param;
    };

    const params = allowedUrlQueryParams.map(
      (key) => `${parseParams(key)}=${this[key] ? 1 : 0}`
    );

    const separator = params.length ? '?' : '';

    return `https://www.youtube.com/embed/${resolveId(
      this.url
    )}${separator}${params.join('&')}`;
  }
}
