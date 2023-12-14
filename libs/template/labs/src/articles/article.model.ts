declare global {
  interface ContentFields {
    article: undefined;
    about: undefined;
    faq: undefined;
  }
}

export interface ArticleContent {
  heading: string;
  description: string;
  content: string;
  type: string;
}
