// organize-imports-ignore
import { CORE_SERVER_PROVIDERS } from '@spryker-oryx/core/server';
import { createInjector } from './bootstrap';
createInjector(CORE_SERVER_PROVIDERS);
import '@spryker-oryx/experience/components';
import './storefront.component';
