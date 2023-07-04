# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.15.0 (2023-07-04)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* cart loading issues  ([#507](https://github.com/spryker/oryx/issues/507)) ([a86b59b](https://github.com/spryker/oryx/commit/a86b59b599da33090a8854380e531c4fba131037))
* FA sw auth ([#367](https://github.com/spryker/oryx/issues/367)) ([1cd7970](https://github.com/spryker/oryx/commit/1cd79701d9c60a4188b3496e9397a622fc2e6eb2))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* typos and capitalization ([#501](https://github.com/spryker/oryx/issues/501)) ([39930e6](https://github.com/spryker/oryx/commit/39930e69e65a3a0815491d32cc985c6d769ee87f))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


* refactor!: Refactored auth and site packages (#540) ([a391e84](https://github.com/spryker/oryx/commit/a391e84d30d987288c983d9d2f7ce0f8c0e06195)), closes [#540](https://github.com/spryker/oryx/issues/540)


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* align prev route ([#457](https://github.com/spryker/oryx/issues/457)) ([5a58f80](https://github.com/spryker/oryx/commit/5a58f806251ef452db5623d82e63e65ac6fe8440))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))


### BREAKING CHANGES

* all components in auth and site packages has been moved
to a separate sub-packages, so now there are not available to import
from the main package.

closes: https://spryker.atlassian.net/browse/HRZ-3025,
https://spryker.atlassian.net/browse/HRZ-2912,
https://spryker.atlassian.net/browse/HRZ-2911,
https://spryker.atlassian.net/browse/HRZ-3024





# 0.13.0 (2023-06-30)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* cart loading issues  ([#507](https://github.com/spryker/oryx/issues/507)) ([a86b59b](https://github.com/spryker/oryx/commit/a86b59b599da33090a8854380e531c4fba131037))
* FA sw auth ([#367](https://github.com/spryker/oryx/issues/367)) ([1cd7970](https://github.com/spryker/oryx/commit/1cd79701d9c60a4188b3496e9397a622fc2e6eb2))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* typos and capitalization ([#501](https://github.com/spryker/oryx/issues/501)) ([39930e6](https://github.com/spryker/oryx/commit/39930e69e65a3a0815491d32cc985c6d769ee87f))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* align prev route ([#457](https://github.com/spryker/oryx/issues/457)) ([5a58f80](https://github.com/spryker/oryx/commit/5a58f806251ef452db5623d82e63e65ac6fe8440))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





## 0.12.1 (2023-06-20)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* FA sw auth ([#367](https://github.com/spryker/oryx/issues/367)) ([1cd7970](https://github.com/spryker/oryx/commit/1cd79701d9c60a4188b3496e9397a622fc2e6eb2))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* align prev route ([#457](https://github.com/spryker/oryx/issues/457)) ([5a58f80](https://github.com/spryker/oryx/commit/5a58f806251ef452db5623d82e63e65ac6fe8440))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





# 0.12.0 (2023-06-20)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* FA sw auth ([#367](https://github.com/spryker/oryx/issues/367)) ([1cd7970](https://github.com/spryker/oryx/commit/1cd79701d9c60a4188b3496e9397a622fc2e6eb2))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* align prev route ([#457](https://github.com/spryker/oryx/issues/457)) ([5a58f80](https://github.com/spryker/oryx/commit/5a58f806251ef452db5623d82e63e65ac6fe8440))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





# 0.11.0 (2023-06-12)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* FA sw auth ([#367](https://github.com/spryker/oryx/issues/367)) ([1cd7970](https://github.com/spryker/oryx/commit/1cd79701d9c60a4188b3496e9397a622fc2e6eb2))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





## 0.10.2 (2023-05-30)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





## 0.10.1 (2023-05-29)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





# 0.10.0 (2023-05-26)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





## 0.9.1 (2023-05-12)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





# 0.9.0 (2023-05-10)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





# 0.8.0 (2023-05-10)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





# 0.7.0 (2023-05-10)


### Bug Fixes

* add error icon to fulfilmment and improve error message ([#319](https://github.com/spryker/oryx/issues/319)) ([c8b9a0b](https://github.com/spryker/oryx/commit/c8b9a0bd5de208b1a559014f03dd2b933bdefeaf))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* style fulfillment login loading screen ([#302](https://github.com/spryker/oryx/issues/302)) ([d4ac097](https://github.com/spryker/oryx/commit/d4ac097816fa5de75d27e03a3366142a56e76166))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))





# 0.6.0 (2023-04-26)


### Bug Fixes

* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))





## 0.5.1 (2023-04-13)


### Bug Fixes

* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))





# 0.5.0 (2023-04-07)


### Bug Fixes

* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* use form element for validation and other built-in form behavior ([#195](https://github.com/spryker/oryx/issues/195)) ([1a3141d](https://github.com/spryker/oryx/commit/1a3141d09daa6f6006f23f54f141ffb58048e10a))


### Features

* add store interceptor ([#164](https://github.com/spryker/oryx/issues/164)) ([2969d84](https://github.com/spryker/oryx/commit/2969d8451d0e1d4dc7e09b2ce92519709bbf65c1))
* cart totals component with fine-grained  sub components  ([#204](https://github.com/spryker/oryx/issues/204)) ([0e9bd7e](https://github.com/spryker/oryx/commit/0e9bd7e3c146289589475801499c10b989d3735f))
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
