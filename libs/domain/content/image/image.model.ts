export interface ContentImageContent {
  image?: string;
  graphic?: string;
  link?: string;
  label?: string;
  alt?: string;
}

/**
 * @deprecated use image style plugin from 1.4 onwards
 */
export interface ContentImageOptions {
  fit?: 'none' | 'contain' | 'cover';
  position?: string;
}
