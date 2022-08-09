// organize-imports-ignore
import './global.shim';
import './bootstrap-injector';
import '@spryker-oryx/product/title';
import './experience-preview';
import '@spryker-oryx/experience/components';
import './storefront.component';
import '@spryker-oryx/ui/card';
import '@spryker-oryx/ui/checkbox';
import '@spryker-oryx/ui/password';
import '@spryker-oryx/ui/rating';
import '@spryker-oryx/ui/button';
import '@spryker-oryx/ui/icon-button';
import '@spryker-oryx/ui/notification';
import '@spryker-oryx/ui/input';
import '@spryker-oryx/ui/icon';
import '@spryker-oryx/ui/link';
import '@spryker-oryx/ui/text';
import { initHydrateHooks, initInlineScripts } from './utils/hydrate-hooks';

initHydrateHooks();
initInlineScripts();
