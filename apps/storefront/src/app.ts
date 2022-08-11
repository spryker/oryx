// organize-imports-ignore
import './global.shim';
import { storefrontApp } from './bootstrap';
import { StorefrontPlugin } from './storefront.plugin';

storefrontApp().with(new StorefrontPlugin()).create().catch(console.error);
