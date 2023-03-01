## First run

To run E2E tests locally you have to create `.env.local` file first.
Use `.env.template` as an example.

## Storfront E2E tests commands

1. `npm run sf:e2e:open` - opens Cypress runner; useful for E2E tests development and debug
2. `npm run sf:e2e:headless` - runs tests locally in headless mode
3. `npm run sf:e2e:headless:ci` - runs tests on CI in headless mode (won't work locally, because it uses Cypress Cloud which is available only on CI servers)
4. `npm run sf:e2e:headless:ci:affected` - used for CI optimization. Will run SF tests only if storefront or storefront-e2e project were affected in PR
