// organize-imports-ignore
import './global.shim';
import { storefront } from './config';
import { StorefrontPlugin } from './storefront.plugin';

storefront.with(new StorefrontPlugin()).create().catch(console.error);
