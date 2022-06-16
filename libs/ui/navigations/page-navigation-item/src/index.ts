import { PageNavigationItemComponent } from './page-navigation-item.component';

export * from './page-navigation-item.component';
export * from './page-navigation-item.styles';

customElements.get('oryx-page-navigation-item') ||
  customElements.define(
    'oryx-page-navigation-item',
    PageNavigationItemComponent
  );
