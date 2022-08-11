import { CART_PROVIDERS } from '@spryker-oryx/cart';
import { addToCartComponent } from '@spryker-oryx/cart/add-to-cart';
import { miniCartComponent } from '@spryker-oryx/cart/mini-cart';
import { quantityInputComponent } from '@spryker-oryx/cart/quantity-input';
import { bannerComponent } from '@spryker-oryx/content/banner';
import { contentLinkComponent } from '@spryker-oryx/content/link';
import { app, AppBuilderWithModules, CORE_PROVIDERS } from '@spryker-oryx/core';
import {
  COMPONENT_MAPPING,
  RouterService,
  STATIC_PROVIDERS,
} from '@spryker-oryx/experience';
import { experienceCompositionComponent } from '@spryker-oryx/experience/components';
import { Provider } from '@spryker-oryx/injector';
import { PRODUCT_PROVIDERS } from '@spryker-oryx/product';
import { productAttributesComponent } from '@spryker-oryx/product/attributes';
import { productAverageRatingComponent } from '@spryker-oryx/product/average-rating';
import { productCardComponent } from '@spryker-oryx/product/card';
import { productDescriptionComponent } from '@spryker-oryx/product/description';
import { productIdComponent } from '@spryker-oryx/product/id';
import { productImagesComponent } from '@spryker-oryx/product/images';
import { productMediaComponent } from '@spryker-oryx/product/media';
import { productPriceComponent } from '@spryker-oryx/product/price';
import { productTitleComponent } from '@spryker-oryx/product/title';
import { SEARCH_PROVIDERS } from '@spryker-oryx/search';
import { searchBoxComponent } from '@spryker-oryx/search/box';
import { SITE_PROVIDERS } from '@spryker-oryx/site';
import { buttonComponent } from '@spryker-oryx/ui/button';
import { cardComponent } from '@spryker-oryx/ui/card';
import { checkboxComponent } from '@spryker-oryx/ui/checkbox';
import { iconComponent } from '@spryker-oryx/ui/icon';
import { iconButtonComponent } from '@spryker-oryx/ui/icon-button';
import { imageComponent } from '@spryker-oryx/ui/image';
import { inputComponent } from '@spryker-oryx/ui/input';
import { linkComponent } from '@spryker-oryx/ui/link';
import { notificationComponent } from '@spryker-oryx/ui/notification';
import { passwordInputComponent } from '@spryker-oryx/ui/password';
import { popoverComponent } from '@spryker-oryx/ui/popover';
import { ratingComponent } from '@spryker-oryx/ui/rating';
import { textComponent } from '@spryker-oryx/ui/text';
import { typeheadComponent } from '@spryker-oryx/ui/typeahead';
import { userLoginComponent } from '@spryker-oryx/user/login';
import { userLogoutComponent } from '@spryker-oryx/user/logout';
import 'urlpattern-polyfill';
import { componentsMapping } from './components';
import { StorefrontRouterService } from './router.service';
import { storefrontComponent } from './storefront.component';

export const APP_PROVIDERS: Provider[] = [
  {
    provide: 'CONTENT_BACKEND_URL',
    useValue: import.meta.env.FES_CONTENT_BACKEND_URL || '',
  },
  {
    provide: 'SCOS_BASE_URL',
    useValue: import.meta.env.SCOS_BASE_URL || '',
  },
  {
    provide: COMPONENT_MAPPING,
    useValue: componentsMapping,
  },
  {
    provide: RouterService,
    useClass: StorefrontRouterService,
  },
];

export function storefrontApp(): AppBuilderWithModules {
  return app()
    .withOptions({
      components: {
        root: storefrontComponent,
      },
    })

    .withProviders(CORE_PROVIDERS)
    .withComponents([
      buttonComponent,
      cardComponent,
      checkboxComponent,
      iconButtonComponent,
      iconComponent,
      imageComponent,
      inputComponent,
      linkComponent,
      notificationComponent,
      passwordInputComponent,
      popoverComponent,
      ratingComponent,
      textComponent,
      typeheadComponent,
      userLoginComponent,
      userLogoutComponent,
    ])

    .withProviders(STATIC_PROVIDERS)
    .withComponents([experienceCompositionComponent])

    .withProviders(APP_PROVIDERS)
    .withComponents([storefrontComponent])

    .withProviders(CART_PROVIDERS)
    .withComponents([
      addToCartComponent,
      miniCartComponent,
      quantityInputComponent,
    ])

    .withProviders(PRODUCT_PROVIDERS)
    .withComponents([
      productAttributesComponent,
      productAverageRatingComponent,
      productCardComponent,
      productDescriptionComponent,
      productIdComponent,
      productImagesComponent,
      productMediaComponent,
      productPriceComponent,
      productTitleComponent,
    ])

    .withProviders(SITE_PROVIDERS)
    .withProviders(SEARCH_PROVIDERS)
    .withComponents([searchBoxComponent])

    .withComponents([bannerComponent, contentLinkComponent]);
}
