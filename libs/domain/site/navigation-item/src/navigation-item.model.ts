import { SemanticLink } from '@spryker-oryx/site';

export interface SiteNavigationItemOptions {
  icon?: string;
  label?: string;
  badge?: string;
  url?: string | SemanticLink;
  triggerType?: NavigationTriggerType;
  triggerBehavior?: NavigationTriggerBehavior;
  contentBehavior?: NavigationContentBehavior;
  //TODO: Implement or drop later
  // items?: NavigationListItem[];
}

export const enum NavigationTriggerType {
  Button = 'button',
  Icon = 'icon',
  //TODO: find better name
  StorefrontButton = 'storefront-button',
}

export const enum NavigationTriggerBehavior {
  Click = 'click',
  Hover = 'hover',
}

export const enum NavigationContentBehavior {
  Modal = 'modal',
  Dropdown = 'dropdown',
  Navigation = 'navigation',
}

export interface NavigationListItem {
  url: string;
  title: string;
  icon?: string;
}
