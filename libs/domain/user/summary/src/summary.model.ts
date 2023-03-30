export interface UserSummaryItem {
  link: string;
  title: string;
  icon?: string;
}

export interface UserSummaryOptions {
  items?: UserSummaryItem[];
}
