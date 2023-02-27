import { VideoAspectRatio, VideoPreload } from '@spryker-oryx/ui/video';

export interface ContentVideoOptions {
  /**
   * The source URL of the video.
   */
  src?: string;

  /**
   * A boolean indicating whether the video should start playing automatically.
   */
  autoplay?: boolean;

  /**
   * A boolean indicating whether the video should play inline with the page rather than in a full-screen mode.
   */
  playsInline?: boolean;

  /**
   * A boolean indicating whether the video should loop back to the start after it finishes playing.
   */
  loop?: boolean;

  /**
   * A boolean indicating whether the video should play with the sound turned off.
   */
  muted?: boolean;

  /**
   * A boolean indicating whether controls should be displayed for the video (e.g., play/pause button).
   */
  controls?: boolean;

  /**
   * Provides a hint to the browser to what content is loaded before the video is played.
   *
   * The autoplay attribute has precedence over preload. If autoplay is specified, the browser would obviously
   * need to start downloading the video for playback.
   */
  preload?: VideoPreload;

  /**
   * Preset ratio's to control the height of the video.
   *
   * The video is rendered 100% by default, so it's important to be able to control the height. A height can be
   * provided by the layout styles, but a preset might simplify the usage.
   */
  aspectRatio?: VideoAspectRatio;
}
