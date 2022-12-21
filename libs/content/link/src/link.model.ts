import { SemanticLinkType } from '@spryker-oryx/site';

export const enum LinkType {
  RawUrl = 'rawUrl',
}

export interface ContentLinkOptions {
  type?: SemanticLinkType | LinkType;
  text?: string;
  id?: string;
  params?: Record<string, string>;
  icon?: string;
  label?: string;
  target?: string;
  noopener?: boolean;
  nofollow?: boolean;
  disabled?: boolean;

  /**
   * Indicates the appearance of the link. By default `oryx-link` is used as
   * wrapper for anchor element.
   * If set renders an `oryx-button`;
   */
  button?: boolean;

  /**
   * Indicates that the link should support multi-line.
   *
   * Multiline vs line clamping is managed in the link component, and will
   * come with non-wrapped text. In case the link is intended to be multi-lined
   * we must avoid this behaviour.
   */
  multiLine?: boolean;
}
