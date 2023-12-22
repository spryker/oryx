# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.9.0 (2023-12-22)


### Bug Fixes

* allow normalized i18n context values 0 ([#667](https://github.com/spryker/oryx/issues/667)) ([bacffa3](https://github.com/spryker/oryx/commit/bacffa325e8e02b6719ccab4c7ff970582148d53))
* HRZ-2189 prepare release ([#1861](https://github.com/spryker/oryx/issues/1861)) ([7cdb48e](https://github.com/spryker/oryx/commit/7cdb48e3c26c1ca8f12d469e9a73d75cd3c03f78))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* HRZ-2278 post release fixes ([#90](https://github.com/spryker/oryx/issues/90)) ([6c66584](https://github.com/spryker/oryx/commit/6c66584f5d1e51dcfc3a23c4beaf04f24b4bdb69))
* leftovers after merging packages layers ([#1719](https://github.com/spryker/oryx/issues/1719)) ([abf41ba](https://github.com/spryker/oryx/commit/abf41ba83682e7d6d4972a130c0f336e59e3faa4))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* wrong locale is set after choosing a locale  ([#590](https://github.com/spryker/oryx/issues/590)) ([f6c0ce6](https://github.com/spryker/oryx/commit/f6c0ce62ed2806573e3316a8a39a2df37e69c218))


### Code Refactoring

* replace async value and async state with signals ([#646](https://github.com/spryker/oryx/issues/646)) ([909aeb3](https://github.com/spryker/oryx/commit/909aeb3e1d1a42129841b1ed5e09c0b0b245532f))


### Features

* **graphical:** icon directionality ([#857](https://github.com/spryker/oryx/issues/857)) ([764ee63](https://github.com/spryker/oryx/commit/764ee634f7764c931b1ee1cd1018acd055b7f385))
* HRZ-1760 Move packages inside package layers ([#1660](https://github.com/spryker/oryx/issues/1660)) ([ed8f07e](https://github.com/spryker/oryx/commit/ed8f07e513a1e2dadb810a72b9785b3fab5fd375)), closes [#1669](https://github.com/spryker/oryx/issues/1669) [#1690](https://github.com/spryker/oryx/issues/1690) [#1693](https://github.com/spryker/oryx/issues/1693)
* **i18n:** add support for links in translations ([#492](https://github.com/spryker/oryx/issues/492)) ([28904ae](https://github.com/spryker/oryx/commit/28904aef140e8ea8779c988051e7b14219fd1a9c))
* meta improvements ([#277](https://github.com/spryker/oryx/issues/277)) ([b13f11f](https://github.com/spryker/oryx/commit/b13f11f4bfe017c7a1405db08eb6ef5ddeca09c2))
* Release workflow ([#29](https://github.com/spryker/oryx/issues/29)) ([8611f72](https://github.com/spryker/oryx/commit/8611f72e2c14f9bef80fa28bd26ca89c7fcacb16))
* replace hardcoded time formatting method ([#206](https://github.com/spryker/oryx/issues/206)) ([77e8cb8](https://github.com/spryker/oryx/commit/77e8cb80d21e9dc0d1091c006061aefa5ec63c91))
* **site:** Added day component ([#980](https://github.com/spryker/oryx/issues/980)) ([eeea7b6](https://github.com/spryker/oryx/commit/eeea7b6240738438fdeebf8af0f8d6ac3cde1490))
* **site:** breadcrumbs ([#735](https://github.com/spryker/oryx/issues/735)) ([8d9ea37](https://github.com/spryker/oryx/commit/8d9ea37fc1ee4decdd40b8a0357909017a2cfd5b))


### BREAKING CHANGES

* `asyncValue` and `asyncState` will no longer be
available. Please use signals instead.


[HRZ-3328]:
https://spryker.atlassian.net/browse/HRZ-3328?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ





# 1.0.0 (2023-07-31)


### Bug Fixes

* HRZ-2189 prepare release ([#1861](https://github.com/spryker/oryx/issues/1861)) ([7cdb48e](https://github.com/spryker/oryx/commit/7cdb48e3c26c1ca8f12d469e9a73d75cd3c03f78))
* HRZ-2278 2nd part of fixes for release ([#118](https://github.com/spryker/oryx/issues/118)) ([992c587](https://github.com/spryker/oryx/commit/992c58714eed594fe900d2645bba4a9a59c0fee2))
* HRZ-2278 post release fixes ([#90](https://github.com/spryker/oryx/issues/90)) ([6c66584](https://github.com/spryker/oryx/commit/6c66584f5d1e51dcfc3a23c4beaf04f24b4bdb69))
* leftovers after merging packages layers ([#1719](https://github.com/spryker/oryx/issues/1719)) ([abf41ba](https://github.com/spryker/oryx/commit/abf41ba83682e7d6d4972a130c0f336e59e3faa4))
* move locale into i18n package ([#181](https://github.com/spryker/oryx/issues/181)) ([eb20c5d](https://github.com/spryker/oryx/commit/eb20c5dbf5bbb35e829b9faa1c1ada8bdc34203a))
* release preparation ([#150](https://github.com/spryker/oryx/issues/150)) ([1225f74](https://github.com/spryker/oryx/commit/1225f74b48928d61d0574a9dc275999c1f0602ac))
* Release/v0.2.0 ([#131](https://github.com/spryker/oryx/issues/131)) ([f7b7ba9](https://github.com/spryker/oryx/commit/f7b7ba9b8dba11e407269fb14b120792b664ab9d))
* wrong locale is set after choosing a locale  ([#590](https://github.com/spryker/oryx/issues/590)) ([f6c0ce6](https://github.com/spryker/oryx/commit/f6c0ce62ed2806573e3316a8a39a2df37e69c218))


### Code Refactoring

* replace async value and async state with signals ([#646](https://github.com/spryker/oryx/issues/646)) ([909aeb3](https://github.com/spryker/oryx/commit/909aeb3e1d1a42129841b1ed5e09c0b0b245532f))


### Features

* HRZ-1760 Move packages inside package layers ([#1660](https://github.com/spryker/oryx/issues/1660)) ([ed8f07e](https://github.com/spryker/oryx/commit/ed8f07e513a1e2dadb810a72b9785b3fab5fd375)), closes [#1669](https://github.com/spryker/oryx/issues/1669) [#1690](https://github.com/spryker/oryx/issues/1690) [#1693](https://github.com/spryker/oryx/issues/1693)
* **i18n:** add support for links in translations ([#492](https://github.com/spryker/oryx/issues/492)) ([28904ae](https://github.com/spryker/oryx/commit/28904aef140e8ea8779c988051e7b14219fd1a9c))
* meta improvements ([#277](https://github.com/spryker/oryx/issues/277)) ([b13f11f](https://github.com/spryker/oryx/commit/b13f11f4bfe017c7a1405db08eb6ef5ddeca09c2))
* Release workflow ([#29](https://github.com/spryker/oryx/issues/29)) ([8611f72](https://github.com/spryker/oryx/commit/8611f72e2c14f9bef80fa28bd26ca89c7fcacb16))
* replace hardcoded time formatting method ([#206](https://github.com/spryker/oryx/issues/206)) ([77e8cb8](https://github.com/spryker/oryx/commit/77e8cb80d21e9dc0d1091c006061aefa5ec63c91))


### BREAKING CHANGES

* `asyncValue` and `asyncState` will no longer be
available. Please use signals instead.


[HRZ-3328]:
https://spryker.atlassian.net/browse/HRZ-3328?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ
