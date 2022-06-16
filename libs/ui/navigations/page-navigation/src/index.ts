import { PageNavigationComponent } from './page-navigation.component';

export * from './page-navigation.component';
export * from './page-navigation.controller';
export * from './page-navigation.styles';

customElements.get('oryx-page-navigation') ||
  customElements.define('oryx-page-navigation', PageNavigationComponent);
