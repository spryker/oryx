# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.4.0](https://github.com/spryker/oryx/compare/lib@1.2.0...lib@1.4.0) (2023-09-18)

**Note:** Version bump only for package @spryker-oryx/resources





# 1.2.0 (2023-09-18)


### Bug Fixes

* switch fulfillment icons to material designs ([#480](https://github.com/spryker/oryx/issues/480)) ([3cd22a2](https://github.com/spryker/oryx/commit/3cd22a2e86c8f183895028ad53b6308575b825c7))
* update correct fulfillment searching graphic ([#474](https://github.com/spryker/oryx/issues/474)) ([88b9527](https://github.com/spryker/oryx/commit/88b95272d167d74bfa06c8a3fd46be6a73200a0a))
* use standard query language for brands ([#672](https://github.com/spryker/oryx/issues/672)) ([ae4175f](https://github.com/spryker/oryx/commit/ae4175fdc11864e7812f2d2486b1839886c89441))


### Code Refactoring

* **ui:** merge button and icon-button component ([#618](https://github.com/spryker/oryx/issues/618)) ([7d3cf72](https://github.com/spryker/oryx/commit/7d3cf72fa003bdae3f6c6523f71095c5a1cab4fb))


### Features

* component scale style option ([#514](https://github.com/spryker/oryx/issues/514)) ([aed9d43](https://github.com/spryker/oryx/commit/aed9d43d5472792baa62cb90b186727833030831))
* **content:** content image component ([#585](https://github.com/spryker/oryx/issues/585)) ([74ee31a](https://github.com/spryker/oryx/commit/74ee31a0b806e02abecbd854e43d739f66825cba))
* **site:** breadcrumbs ([#735](https://github.com/spryker/oryx/issues/735)) ([8d9ea37](https://github.com/spryker/oryx/commit/8d9ea37fc1ee4decdd40b8a0357909017a2cfd5b))


### BREAKING CHANGES

* **ui:** - The `oryx-icon-button` is removed, use `<oryx-button type="icon">`
going forward.
- Previously, it was mandatory to _slot in_ a `<button>` or `<a>`
element. While this is still supported, using the `slot="custom"`,
buttons will now create the button or link based on properties.
- The `type` property was previously used to indicate both the color and
style. This has been separated, so that you can define the `type` using
the `ButtonType` enum (`solid`, `outline`, `icon` or `text`) and the
color using the `ButtonColor` enum (`primary`, `neutral` or `error`)
separately.
- Previously the `outline` was set as a separate property, this property
is removed and moved into the `ButtonType` enum.
- The `size` property is now limited to the values of the `ButtonType`,
so that other sizes (`xs` and `xl`) cannot be used on the button
component.


[HRZ-3283]:
https://spryker.atlassian.net/browse/HRZ-3283?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ
* **content:** The banner component is removed. 

[HRZ-3216]:
https://spryker.atlassian.net/browse/HRZ-3216?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ





# 1.1.0 (2023-09-18)


### Bug Fixes

* switch fulfillment icons to material designs ([#480](https://github.com/spryker/oryx/issues/480)) ([3cd22a2](https://github.com/spryker/oryx/commit/3cd22a2e86c8f183895028ad53b6308575b825c7))
* update correct fulfillment searching graphic ([#474](https://github.com/spryker/oryx/issues/474)) ([88b9527](https://github.com/spryker/oryx/commit/88b95272d167d74bfa06c8a3fd46be6a73200a0a))
* use standard query language for brands ([#672](https://github.com/spryker/oryx/issues/672)) ([ae4175f](https://github.com/spryker/oryx/commit/ae4175fdc11864e7812f2d2486b1839886c89441))


### Code Refactoring

* **ui:** merge button and icon-button component ([#618](https://github.com/spryker/oryx/issues/618)) ([7d3cf72](https://github.com/spryker/oryx/commit/7d3cf72fa003bdae3f6c6523f71095c5a1cab4fb))


### Features

* component scale style option ([#514](https://github.com/spryker/oryx/issues/514)) ([aed9d43](https://github.com/spryker/oryx/commit/aed9d43d5472792baa62cb90b186727833030831))
* **content:** content image component ([#585](https://github.com/spryker/oryx/issues/585)) ([74ee31a](https://github.com/spryker/oryx/commit/74ee31a0b806e02abecbd854e43d739f66825cba))
* **site:** breadcrumbs ([#735](https://github.com/spryker/oryx/issues/735)) ([8d9ea37](https://github.com/spryker/oryx/commit/8d9ea37fc1ee4decdd40b8a0357909017a2cfd5b))


### BREAKING CHANGES

* **ui:** - The `oryx-icon-button` is removed, use `<oryx-button type="icon">`
going forward.
- Previously, it was mandatory to _slot in_ a `<button>` or `<a>`
element. While this is still supported, using the `slot="custom"`,
buttons will now create the button or link based on properties.
- The `type` property was previously used to indicate both the color and
style. This has been separated, so that you can define the `type` using
the `ButtonType` enum (`solid`, `outline`, `icon` or `text`) and the
color using the `ButtonColor` enum (`primary`, `neutral` or `error`)
separately.
- Previously the `outline` was set as a separate property, this property
is removed and moved into the `ButtonType` enum.
- The `size` property is now limited to the values of the `ButtonType`,
so that other sizes (`xs` and `xl`) cannot be used on the button
component.


[HRZ-3283]:
https://spryker.atlassian.net/browse/HRZ-3283?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ
* **content:** The banner component is removed. 

[HRZ-3216]:
https://spryker.atlassian.net/browse/HRZ-3216?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ





# 1.0.0 (2023-07-31)


### Bug Fixes

* switch fulfillment icons to material designs ([#480](https://github.com/spryker/oryx/issues/480)) ([3cd22a2](https://github.com/spryker/oryx/commit/3cd22a2e86c8f183895028ad53b6308575b825c7))
* update correct fulfillment searching graphic ([#474](https://github.com/spryker/oryx/issues/474)) ([88b9527](https://github.com/spryker/oryx/commit/88b95272d167d74bfa06c8a3fd46be6a73200a0a))
* use standard query language for brands ([#672](https://github.com/spryker/oryx/issues/672)) ([ae4175f](https://github.com/spryker/oryx/commit/ae4175fdc11864e7812f2d2486b1839886c89441))


### Code Refactoring

* **ui:** merge button and icon-button component ([#618](https://github.com/spryker/oryx/issues/618)) ([7d3cf72](https://github.com/spryker/oryx/commit/7d3cf72fa003bdae3f6c6523f71095c5a1cab4fb))


### Features

* component scale style option ([#514](https://github.com/spryker/oryx/issues/514)) ([aed9d43](https://github.com/spryker/oryx/commit/aed9d43d5472792baa62cb90b186727833030831))
* **content:** content image component ([#585](https://github.com/spryker/oryx/issues/585)) ([74ee31a](https://github.com/spryker/oryx/commit/74ee31a0b806e02abecbd854e43d739f66825cba))


### BREAKING CHANGES

* **ui:** - The `oryx-icon-button` is removed, use `<oryx-button type="icon">`
going forward.
- Previously, it was mandatory to _slot in_ a `<button>` or `<a>`
element. While this is still supported, using the `slot="custom"`,
buttons will now create the button or link based on properties.
- The `type` property was previously used to indicate both the color and
style. This has been separated, so that you can define the `type` using
the `ButtonType` enum (`solid`, `outline`, `icon` or `text`) and the
color using the `ButtonColor` enum (`primary`, `neutral` or `error`)
separately.
- Previously the `outline` was set as a separate property, this property
is removed and moved into the `ButtonType` enum.
- The `size` property is now limited to the values of the `ButtonType`,
so that other sizes (`xs` and `xl`) cannot be used on the button
component.


[HRZ-3283]:
https://spryker.atlassian.net/browse/HRZ-3283?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ
* **content:** The banner component is removed. 

[HRZ-3216]:
https://spryker.atlassian.net/browse/HRZ-3216?atlOrigin=eyJpIjoiNWRkNTljNzYxNjVmNDY3MDlhMDU5Y2ZhYzA5YTRkZjUiLCJwIjoiZ2l0aHViLWNvbS1KU1cifQ
