export interface ContentTextOptions {
  /**
   * Allows to set a font face.
   */
  font?: string;

  /**
   * Include font face in the header of page.
   */
  autoInstallFont?: boolean;

  /**
   * Font size.
   */
  size?: string;

  tag?: string;

  lineHeight?: string;
  color?: string;
}

export interface ContentTextContent {
  text?: string;
}
