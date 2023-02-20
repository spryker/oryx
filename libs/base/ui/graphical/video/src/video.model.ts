export const enum VideoPreload {
  None = 'none',
  Metadata = 'metadata',
  Auto = 'auto',
}

export const enum VideoAspectRatio {
  '9/1' = '9/1',
  '21/9' = '21/9',
  '16/9' = '16/9',
  '4/3' = '4/3',
}

export interface VideoAttributes {
  /**
   * The source URL of the video.
   */
  url?: string;

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
