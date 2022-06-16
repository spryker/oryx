import { NavigationItemComponent } from './navigation-item.component';

customElements.get('oryx-navigation-item') ||
  customElements.define('oryx-navigation-item', NavigationItemComponent);
