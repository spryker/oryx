export interface LinkContent {
  text: string;
  href: string;
  icon?: string;
}

export interface LinkOptions {
  target?: string;
  noopener?: boolean;
  nofollow?: boolean;
}
