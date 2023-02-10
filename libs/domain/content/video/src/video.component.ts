import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ssrShim, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { tap } from 'rxjs';
import { ContentVideoOptions } from './video.model';
import { videoStyles } from './video.styles';

@defaultOptions({
  autoplay: true,
  playsInline: true,
  muted: true,
  loop: true,
  aspectRatio: '21/9',
})
@ssrShim('style')
export class ContentVideoComponent extends ContentMixin<ContentVideoOptions>(
  LitElement
) {
  static styles = [videoStyles];

  @subscribe()
  protected options$ = this.contentController.getOptions().pipe(
    tap((options) => {
      if (options.aspectRatio) {
        this.style.setProperty('--aspect-ratio', options.aspectRatio);
      }
    })
  );

  protected override render(): TemplateResult | void {
    const options = this.componentOptions;

    if (!options?.src) return;

    if (this.isYoutube(options.src)) {
      return html`<object
        data=${ifDefined(this.resolveYoutubeUrl(options))}
      ></object>`;
    } else {
      return html` <video
        ?autoplay=${options.autoplay}
        ?controls=${options.controls}
        ?loop=${options.loop}
        ?muted=${options.muted}
        preload=${ifDefined(options.preload)}
        ?playsInline=${options.playsInline}
      >
        <source src=${ifDefined(options.src)} />
      </video>`;
    }
  }

  protected isYoutube(url: string): boolean {
    return /youtu.be|youtube/g.test(url);
  }

  protected resolveYoutubeUrl(
    options: ContentVideoOptions
  ): string | undefined {
    if (!options.src) {
      return;
    }

    const resolveId = (url: string): string | null | undefined => {
      if (url.includes('youtu.be')) {
        return url.split('/').pop();
      } else if (url.includes('youtube.com')) {
        if (url.includes('/embed/')) {
          return url.split('/embed/').pop()?.split('?')[0];
        }
        return new URL(url).searchParams.get('v');
      }
      return;
    };

    const allowedUrlQueryParams: (keyof ContentVideoOptions)[] = [
      'loop',
      'autoplay',
      'controls',
      'muted',
    ];

    const params = allowedUrlQueryParams
      .filter((key) => !!options[key])
      .map((key) => `&${key}=${options[key]}`);

    const separator = params.length ? '?' : '';

    return `https://www.youtube.com/embed/${resolveId(
      options.src
    )}${separator}${params.join('')}`;
  }
}
