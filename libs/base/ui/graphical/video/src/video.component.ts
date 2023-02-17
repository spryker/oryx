import { ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { VideoAspectRatio, VideoAttributes, VideoPreload } from './video.model';
import { videoStyles } from './video.styles';

@ssrShim('style')
export default class VideoComponent
  extends LitElement
  implements VideoAttributes
{
  static styles = [videoStyles];

  @property() url?: string;
  @property({ type: Boolean }) autoplay?: boolean;
  @property({ type: Boolean }) controls?: boolean;
  @property({ type: Boolean }) loop?: boolean;
  @property({ type: Boolean }) muted?: boolean;
  @property({ type: Boolean }) playsInline?: boolean;
  @property() preload?: VideoPreload;
  @property() set aspectRatio(value: VideoAspectRatio) {
    this.style.setProperty('--aspect-ratio', value);
    this.style.setProperty('height', value ? '' : 'var(--height)');
  }

  protected override render(): TemplateResult | void {
    if (!this.url) return;

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
    if (!this.url) return;

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

    const params = allowedUrlQueryParams
      .filter((key) => !!this[key])
      .map((key) => `&${key}=${this[key]}`);

    const separator = params.length ? '?' : '';

    return `https://www.youtube.com/embed/${resolveId(
      this.url
    )}${separator}${params.join('')}`;
  }
}
