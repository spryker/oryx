declare global {
  interface DynamicContentFields {
    article: undefined;
  }
}

export interface ArticleContent {
  heading: string;
  description: string;
  content: string;
  type: string;
}
