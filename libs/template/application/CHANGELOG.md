# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.10.0](https://github.com/spryker/oryx/compare/lib@1.9.0...lib@1.10.0) (2023-12-22)

**Note:** Version bump only for package @spryker-oryx/application





# 1.9.0 (2023-12-22)


### Bug Fixes

* **application:** aplication service worker sub-package exports ordering ([#901](https://github.com/spryker/oryx/issues/901)) ([bf4bb8a](https://github.com/spryker/oryx/commit/bf4bb8af2f658b450ba6f7587b17cce2538b6e67))
* cart layout is too small ([#221](https://github.com/spryker/oryx/issues/221)) ([76b164e](https://github.com/spryker/oryx/commit/76b164ebe2bca7f3f8a40b8330bd60ac839fa2c0))
* Fixed wrong imports and dependencies to make dev SSR build working ([#299](https://github.com/spryker/oryx/issues/299)) ([1ca1fab](https://github.com/spryker/oryx/commit/1ca1fabc034a435f089f977dc05189bd11d409ac))
* HRZ-2189 prepare release ([#1861](https://github.com/spryker/oryx/issues/1861)) ([7cdb48e](https://github.com/spryker/oryx/commit/7cdb48e3c26c1ca8f12d469e9a73d75cd3c03f78))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* HRZ-2278 post release fixes ([#90](https://github.com/spryker/oryx/issues/90)) ([6c66584](https://github.com/spryker/oryx/commit/6c66584f5d1e51dcfc3a23c4beaf04f24b4bdb69))
* hydration support ([#122](https://github.com/spryker/oryx/issues/122)) ([7c196cd](https://github.com/spryker/oryx/commit/7c196cd145b5add5b261f637d8476d6b97665f32))
* leftovers after merging packages layers ([#1719](https://github.com/spryker/oryx/issues/1719)) ([abf41ba](https://github.com/spryker/oryx/commit/abf41ba83682e7d6d4972a130c0f336e59e3faa4))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* product title ellipses ([#629](https://github.com/spryker/oryx/issues/629)) ([e719bda](https://github.com/spryker/oryx/commit/e719bdabcd22caf52be1f429472549a3827076df))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* replace injector peerDependency with di ([#1828](https://github.com/spryker/oryx/issues/1828)) ([879614f](https://github.com/spryker/oryx/commit/879614f5e7cda0ba45ece4f12cce386457ab6105))
* SCOS backend URL cannot be set by provider only ([6f93374](https://github.com/spryker/oryx/commit/6f9337405be33e64a2813a6809d075756c0fb647))
* ssr lambda is broken ([#106](https://github.com/spryker/oryx/issues/106)) ([a1bd045](https://github.com/spryker/oryx/commit/a1bd04514894870cc97156311fd0016a24a21c8d))
* upgrade lit to ^2.6.0 ([#18](https://github.com/spryker/oryx/issues/18)) ([03c7379](https://github.com/spryker/oryx/commit/03c7379ea6977e77943fe820352e117266482881))


* refactor!: moved bapi and sapi features from the application to the auth (#642) ([18be38e](https://github.com/spryker/oryx/commit/18be38e70d3a5345160a3dd5c65c6f151d22b4d9)), closes [#642](https://github.com/spryker/oryx/issues/642)
* refactor!: Refactored auth and site packages (#540) ([a391e84](https://github.com/spryker/oryx/commit/a391e84d30d987288c983d9d2f7ce0f8c0e06195)), closes [#540](https://github.com/spryker/oryx/issues/540)


### Features

* add app initializer ([#194](https://github.com/spryker/oryx/issues/194)) ([50fd6c2](https://github.com/spryker/oryx/commit/50fd6c27c7c0072ecc8ef080c37b110499a933dc))
* add color tokens parsing as layers ([#99](https://github.com/spryker/oryx/issues/99)) ([d8f7894](https://github.com/spryker/oryx/commit/d8f78947229b1e55a2f9d9a75573e0c8aafc2204))
* add context fallback ([#41](https://github.com/spryker/oryx/issues/41)) ([01c6f27](https://github.com/spryker/oryx/commit/01c6f2744ad5409d8453162005c1c997fd840db6))
* add font icons support ([#341](https://github.com/spryker/oryx/issues/341)) ([a931a6e](https://github.com/spryker/oryx/commit/a931a6ef4b030fef926ef360ce662cfc9a21666a))
* add merge strategies for experience data ([#661](https://github.com/spryker/oryx/issues/661)) ([cf3641c](https://github.com/spryker/oryx/commit/cf3641c7ebed335c0ab15c707b87aebc9a18d496))
* add radix ui support for color system ([#312](https://github.com/spryker/oryx/issues/312)) ([b4b8d54](https://github.com/spryker/oryx/commit/b4b8d54e9f6c7f557e840cacc748a42e3f9e36c0))
* add static data into eb ([#81](https://github.com/spryker/oryx/issues/81)) ([acdc1e7](https://github.com/spryker/oryx/commit/acdc1e7721942b607ec0a3637ee15534848b5c79))
* add toggle color mode component ([#113](https://github.com/spryker/oryx/issues/113)) ([d251149](https://github.com/spryker/oryx/commit/d2511492140d673159d1b5a93d5f8a54fceef43e))
* add ttl to netlify lambda handler ([#564](https://github.com/spryker/oryx/issues/564)) ([b960e68](https://github.com/spryker/oryx/commit/b960e68e8bfa11c4e4fbdaf3eea7fe9d8cd93aae))
* add unit tests for directionality controller ([#255](https://github.com/spryker/oryx/issues/255)) ([e20cbba](https://github.com/spryker/oryx/commit/e20cbba958b84406cbe2ecd1c7e06441965777a8))
* configurable forced color mode ([#907](https://github.com/spryker/oryx/issues/907)) ([eda800f](https://github.com/spryker/oryx/commit/eda800f3c18175b5c03a2085daff69d3cb384b62))
* **content:** update content service to possibility use adapters by config ([#755](https://github.com/spryker/oryx/issues/755)) ([43089dc](https://github.com/spryker/oryx/commit/43089dc3326448c58f99978e8c42385f238ccc2f))
* **core:** add font preloading ([#616](https://github.com/spryker/oryx/issues/616)) ([51df799](https://github.com/spryker/oryx/commit/51df7996bce8d08a11fd9ca5f6a5fded614f9610))
* directionality auto switch ([#162](https://github.com/spryker/oryx/issues/162)) ([b4d1fcc](https://github.com/spryker/oryx/commit/b4d1fccf30a2e637acae5cc5dc1effe54bcaaf02))
* **e2e:** add sf e2e tests ([#96](https://github.com/spryker/oryx/issues/96)) ([4a4c04f](https://github.com/spryker/oryx/commit/4a4c04f7567d19eb3fe9f16a7e63ca5b427b4408))
* event repeater ([#799](https://github.com/spryker/oryx/issues/799)) ([4078fed](https://github.com/spryker/oryx/commit/4078fed93c93ce7843d6e526d0396c27657855b5))
* expand fulfillment login e2e tests ([#318](https://github.com/spryker/oryx/issues/318)) ([8d654be](https://github.com/spryker/oryx/commit/8d654be4fb133b33de3e812e21854968bea5a031)), closes [#320](https://github.com/spryker/oryx/issues/320)
* **experience:** configurable typography for compositions ([#579](https://github.com/spryker/oryx/issues/579)) ([20232fa](https://github.com/spryker/oryx/commit/20232fa5e2fc69194c8e6ed10fdedbf33e37d41a))
* **experience:** Layout Transition Property Plugin ([#962](https://github.com/spryker/oryx/issues/962)) ([21c42a6](https://github.com/spryker/oryx/commit/21c42a6f29f0afed9b7d76567c4b5f3eb5e5da5d))
* fulfillment app boilerplate improvements ([#790](https://github.com/spryker/oryx/issues/790)) ([055ca1b](https://github.com/spryker/oryx/commit/055ca1bff348fb82beb896d7f9442ae2fced814b))
* HRZ-1760 Move packages inside package layers ([#1660](https://github.com/spryker/oryx/issues/1660)) ([ed8f07e](https://github.com/spryker/oryx/commit/ed8f07e513a1e2dadb810a72b9785b3fab5fd375)), closes [#1669](https://github.com/spryker/oryx/issues/1669) [#1690](https://github.com/spryker/oryx/issues/1690) [#1693](https://github.com/spryker/oryx/issues/1693)
* **i18n:** add support for links in translations ([#492](https://github.com/spryker/oryx/issues/492)) ([28904ae](https://github.com/spryker/oryx/commit/28904aef140e8ea8779c988051e7b14219fd1a9c))
* implement controller for route order ref ([#1778](https://github.com/spryker/oryx/issues/1778)) ([3a17143](https://github.com/spryker/oryx/commit/3a17143734525445b8bbcb9cff151eae419e26fe))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* layout2.0 ([#1756](https://github.com/spryker/oryx/issues/1756)) ([aa9e594](https://github.com/spryker/oryx/commit/aa9e594e1569429da400aad4306c18498eba1334))
* meta improvements ([#277](https://github.com/spryker/oryx/issues/277)) ([b13f11f](https://github.com/spryker/oryx/commit/b13f11f4bfe017c7a1405db08eb6ef5ddeca09c2))
* meta service ([#257](https://github.com/spryker/oryx/issues/257)) ([860ad6f](https://github.com/spryker/oryx/commit/860ad6f524feb19b8776bb572827790de26d6f00))
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* picking header back button logic ([#417](https://github.com/spryker/oryx/issues/417)) ([3e4fd00](https://github.com/spryker/oryx/commit/3e4fd007327fb5359c662c290a6bac3e0459ef32))
* **preset:** fulfillment boilerplate html cleanup ([#916](https://github.com/spryker/oryx/issues/916)) ([ed1ebd4](https://github.com/spryker/oryx/commit/ed1ebd4c11b6ca69b39f42f26383456bd4664a45))
* **presets:** favicon dark mode ([#929](https://github.com/spryker/oryx/issues/929)) ([09ba468](https://github.com/spryker/oryx/commit/09ba4688b30d65568b29dccb4552e5e4043d40e1))
* Release workflow ([#29](https://github.com/spryker/oryx/issues/29)) ([8611f72](https://github.com/spryker/oryx/commit/8611f72e2c14f9bef80fa28bd26ca89c7fcacb16))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))


### BREAKING CHANGES

* `bapi` and `sapi` features are no longer a part of the
`application`, but moved to the `auth`


[HRZ-3295]:
https://spryker.atlassian.net/browse/HRZ-3295?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ
* **experience:** we've moved the global font size of the html the root
of the document (using `ThemeMetaInitializer`, so that we can move our
typography font-size tokens to `rem` rather than `em`. Previously, all
typography was based on `em`.

[HRZ-3187]:
https://spryker.atlassian.net/browse/HRZ-3187?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ
* all components in auth and site packages has been moved
to a separate sub-packages, so now there are not available to import
from the main package.

closes: https://spryker.atlassian.net/browse/HRZ-3025,
https://spryker.atlassian.net/browse/HRZ-2912,
https://spryker.atlassian.net/browse/HRZ-2911,
https://spryker.atlassian.net/browse/HRZ-3024





# 1.0.0 (2023-07-31)


### Bug Fixes

* cart layout is too small ([#221](https://github.com/spryker/oryx/issues/221)) ([76b164e](https://github.com/spryker/oryx/commit/76b164ebe2bca7f3f8a40b8330bd60ac839fa2c0))
* Fixed wrong imports and dependencies to make dev SSR build working ([#299](https://github.com/spryker/oryx/issues/299)) ([1ca1fab](https://github.com/spryker/oryx/commit/1ca1fabc034a435f089f977dc05189bd11d409ac))
* HRZ-2189 prepare release ([#1861](https://github.com/spryker/oryx/issues/1861)) ([7cdb48e](https://github.com/spryker/oryx/commit/7cdb48e3c26c1ca8f12d469e9a73d75cd3c03f78))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* HRZ-2278 post release fixes ([#90](https://github.com/spryker/oryx/issues/90)) ([6c66584](https://github.com/spryker/oryx/commit/6c66584f5d1e51dcfc3a23c4beaf04f24b4bdb69))
* hydration support ([#122](https://github.com/spryker/oryx/issues/122)) ([7c196cd](https://github.com/spryker/oryx/commit/7c196cd145b5add5b261f637d8476d6b97665f32))
* leftovers after merging packages layers ([#1719](https://github.com/spryker/oryx/issues/1719)) ([abf41ba](https://github.com/spryker/oryx/commit/abf41ba83682e7d6d4972a130c0f336e59e3faa4))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* replace injector peerDependency with di ([#1828](https://github.com/spryker/oryx/issues/1828)) ([879614f](https://github.com/spryker/oryx/commit/879614f5e7cda0ba45ece4f12cce386457ab6105))
* SCOS backend URL cannot be set by provider only ([6f93374](https://github.com/spryker/oryx/commit/6f9337405be33e64a2813a6809d075756c0fb647))
* ssr lambda is broken ([#106](https://github.com/spryker/oryx/issues/106)) ([a1bd045](https://github.com/spryker/oryx/commit/a1bd04514894870cc97156311fd0016a24a21c8d))
* upgrade lit to ^2.6.0 ([#18](https://github.com/spryker/oryx/issues/18)) ([03c7379](https://github.com/spryker/oryx/commit/03c7379ea6977e77943fe820352e117266482881))


* refactor!: moved bapi and sapi features from the application to the auth (#642) ([18be38e](https://github.com/spryker/oryx/commit/18be38e70d3a5345160a3dd5c65c6f151d22b4d9)), closes [#642](https://github.com/spryker/oryx/issues/642)
* refactor!: Refactored auth and site packages (#540) ([a391e84](https://github.com/spryker/oryx/commit/a391e84d30d987288c983d9d2f7ce0f8c0e06195)), closes [#540](https://github.com/spryker/oryx/issues/540)


### Features

* add app initializer ([#194](https://github.com/spryker/oryx/issues/194)) ([50fd6c2](https://github.com/spryker/oryx/commit/50fd6c27c7c0072ecc8ef080c37b110499a933dc))
* add color tokens parsing as layers ([#99](https://github.com/spryker/oryx/issues/99)) ([d8f7894](https://github.com/spryker/oryx/commit/d8f78947229b1e55a2f9d9a75573e0c8aafc2204))
* add context fallback ([#41](https://github.com/spryker/oryx/issues/41)) ([01c6f27](https://github.com/spryker/oryx/commit/01c6f2744ad5409d8453162005c1c997fd840db6))
* add font icons support ([#341](https://github.com/spryker/oryx/issues/341)) ([a931a6e](https://github.com/spryker/oryx/commit/a931a6ef4b030fef926ef360ce662cfc9a21666a))
* add merge strategies for experience data ([#661](https://github.com/spryker/oryx/issues/661)) ([cf3641c](https://github.com/spryker/oryx/commit/cf3641c7ebed335c0ab15c707b87aebc9a18d496))
* add radix ui support for color system ([#312](https://github.com/spryker/oryx/issues/312)) ([b4b8d54](https://github.com/spryker/oryx/commit/b4b8d54e9f6c7f557e840cacc748a42e3f9e36c0))
* add static data into eb ([#81](https://github.com/spryker/oryx/issues/81)) ([acdc1e7](https://github.com/spryker/oryx/commit/acdc1e7721942b607ec0a3637ee15534848b5c79))
* add toggle color mode component ([#113](https://github.com/spryker/oryx/issues/113)) ([d251149](https://github.com/spryker/oryx/commit/d2511492140d673159d1b5a93d5f8a54fceef43e))
* add ttl to netlify lambda handler ([#564](https://github.com/spryker/oryx/issues/564)) ([b960e68](https://github.com/spryker/oryx/commit/b960e68e8bfa11c4e4fbdaf3eea7fe9d8cd93aae))
* add unit tests for directionality controller ([#255](https://github.com/spryker/oryx/issues/255)) ([e20cbba](https://github.com/spryker/oryx/commit/e20cbba958b84406cbe2ecd1c7e06441965777a8))
* **core:** add font preloading ([#616](https://github.com/spryker/oryx/issues/616)) ([51df799](https://github.com/spryker/oryx/commit/51df7996bce8d08a11fd9ca5f6a5fded614f9610))
* directionality auto switch ([#162](https://github.com/spryker/oryx/issues/162)) ([b4d1fcc](https://github.com/spryker/oryx/commit/b4d1fccf30a2e637acae5cc5dc1effe54bcaaf02))
* **e2e:** add sf e2e tests ([#96](https://github.com/spryker/oryx/issues/96)) ([4a4c04f](https://github.com/spryker/oryx/commit/4a4c04f7567d19eb3fe9f16a7e63ca5b427b4408))
* expand fulfillment login e2e tests ([#318](https://github.com/spryker/oryx/issues/318)) ([8d654be](https://github.com/spryker/oryx/commit/8d654be4fb133b33de3e812e21854968bea5a031)), closes [#320](https://github.com/spryker/oryx/issues/320)
* **experience:** configurable typography for compositions ([#579](https://github.com/spryker/oryx/issues/579)) ([20232fa](https://github.com/spryker/oryx/commit/20232fa5e2fc69194c8e6ed10fdedbf33e37d41a))
* HRZ-1760 Move packages inside package layers ([#1660](https://github.com/spryker/oryx/issues/1660)) ([ed8f07e](https://github.com/spryker/oryx/commit/ed8f07e513a1e2dadb810a72b9785b3fab5fd375)), closes [#1669](https://github.com/spryker/oryx/issues/1669) [#1690](https://github.com/spryker/oryx/issues/1690) [#1693](https://github.com/spryker/oryx/issues/1693)
* **i18n:** add support for links in translations ([#492](https://github.com/spryker/oryx/issues/492)) ([28904ae](https://github.com/spryker/oryx/commit/28904aef140e8ea8779c988051e7b14219fd1a9c))
* implement controller for route order ref ([#1778](https://github.com/spryker/oryx/issues/1778)) ([3a17143](https://github.com/spryker/oryx/commit/3a17143734525445b8bbcb9cff151eae419e26fe))
* implement fulfillment login page ([#213](https://github.com/spryker/oryx/issues/213)) ([179670d](https://github.com/spryker/oryx/commit/179670d88338241e26cedc05bbe73c52565a020a)), closes [#234](https://github.com/spryker/oryx/issues/234)
* layout2.0 ([#1756](https://github.com/spryker/oryx/issues/1756)) ([aa9e594](https://github.com/spryker/oryx/commit/aa9e594e1569429da400aad4306c18498eba1334))
* meta improvements ([#277](https://github.com/spryker/oryx/issues/277)) ([b13f11f](https://github.com/spryker/oryx/commit/b13f11f4bfe017c7a1405db08eb6ef5ddeca09c2))
* meta service ([#257](https://github.com/spryker/oryx/issues/257)) ([860ad6f](https://github.com/spryker/oryx/commit/860ad6f524feb19b8776bb572827790de26d6f00))
* navigation item ([#172](https://github.com/spryker/oryx/issues/172)) ([dbea871](https://github.com/spryker/oryx/commit/dbea8717aa5c61391938f41c831db2f775fb3c04))
* picking header back button logic ([#417](https://github.com/spryker/oryx/issues/417)) ([3e4fd00](https://github.com/spryker/oryx/commit/3e4fd007327fb5359c662c290a6bac3e0459ef32))
* Release workflow ([#29](https://github.com/spryker/oryx/issues/29)) ([8611f72](https://github.com/spryker/oryx/commit/8611f72e2c14f9bef80fa28bd26ca89c7fcacb16))
* style fulfillment login page ([#313](https://github.com/spryker/oryx/issues/313)) ([dcae0ad](https://github.com/spryker/oryx/commit/dcae0ad9139eaab935d4c04498e8f3c12ce28fb9))


### BREAKING CHANGES

* `bapi` and `sapi` features are no longer a part of the
`application`, but moved to the `auth`


[HRZ-3295]:
https://spryker.atlassian.net/browse/HRZ-3295?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ
* **experience:** we've moved the global font size of the html the root
of the document (using `ThemeMetaInitializer`, so that we can move our
typography font-size tokens to `rem` rather than `em`. Previously, all
typography was based on `em`.

[HRZ-3187]:
https://spryker.atlassian.net/browse/HRZ-3187?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ
* all components in auth and site packages has been moved
to a separate sub-packages, so now there are not available to import
from the main package.

closes: https://spryker.atlassian.net/browse/HRZ-3025,
https://spryker.atlassian.net/browse/HRZ-2912,
https://spryker.atlassian.net/browse/HRZ-2911,
https://spryker.atlassian.net/browse/HRZ-3024
