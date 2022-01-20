import { NavigationComponent } from './navigation.component';

customElements.get('oryx-navigation') ||
  customElements.define('oryx-navigation', NavigationComponent);
