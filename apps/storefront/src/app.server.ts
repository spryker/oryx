// organize-imports-ignore
import { CORE_SERVER_PROVIDERS } from '@spryker-oryx/core/server';
import { createInjector } from './bootstrap';
createInjector(CORE_SERVER_PROVIDERS);
import './experience-preview';
import '@spryker-oryx/product/title';
import '@spryker-oryx/ui/rating';
import '@spryker-oryx/experience/components';
import '@spryker-oryx/ui/text';
import '@spryker-oryx/ui/link';
import './storefront.component';
