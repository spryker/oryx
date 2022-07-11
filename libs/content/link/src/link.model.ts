export interface LinkContent {
  text: string;
  href: string;
  icon?: string;
}

export interface LinkOptions {
  label?: string;
  target?: string;
  noopener?: boolean;
  nofollow?: boolean;
}
