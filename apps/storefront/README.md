## Oryx Storefront

Composable Storefront boilerplate. This code is used by developers and the CI to test the storefront.

## Quickstart

1. `npm install`
2. `npm run dev` - start dev server
3. `npm run build` - build for production (client, ssr)

## Server side rendering

- `npm run dev:ssr` - start dev server with SSR support
- `npm run build:ssr --omit=dev` - builds for production with SSR support

## Quickstart from the monorepo

- `nx build storefront` builds storefront for production (client, ssr)
- `nx build:client storefront` builds storefront client side mode only
- `nx build:ssr storefront` builds storefront client side mode only
- `nx serve storefront` runs storefront in dev mode (client side only)
- `nx serve-ssr storefront` runs storefront in dev mode with SSR support
- `nx serve-prod storefront` runs storefront in dev mode with SSR support for production
