export interface ContentImageContent {
  image?: string;
  graphic?: string;
  link?: string;
  label?: string;
  alt?: string;
}

export interface ContentImageOptions {
  fit?: 'none' | 'contain' | 'cover';
  position?: string;
}
