import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { VideoAspectRatio } from '@spryker-oryx/ui/video';
import { ssrShim } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ContentVideoOptions } from './video.model';
import { videoStyles } from './video.styles';

@defaultOptions({
  autoplay: true,
  playsInline: true,
  muted: true,
  loop: true,
  aspectRatio: VideoAspectRatio['21/9'],
})
@ssrShim('style')
export class ContentVideoComponent extends ContentMixin<ContentVideoOptions>(
  LitElement
) {
  static styles = [videoStyles];

  protected override render(): TemplateResult | void {
    const options = this.$options();

    if (!options?.src) return;

    return html`<oryx-video
      .url=${options.src}
      ?autoplay=${options.autoplay}
      ?controls=${options.controls}
      ?loop=${options.loop}
      ?muted=${options.muted}
      ?playsInline=${options.playsInline}
      .preload=${options.preload}
      .aspectRatio=${options.aspectRatio}
    ></oryx-video>`;
  }
}
