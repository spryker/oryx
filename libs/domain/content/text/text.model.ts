export interface ContentTextOptions {
  /**
   * Include font face in the header of page.
   */
  autoInstallFont?: boolean;

  tag?: string;
}

export interface ContentTextContent {
  text?: string;
}

export interface TextAttributes {
  tag?: string;
  toggle?: boolean;
  lines?: number;
}
