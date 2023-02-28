## Run Cypress Storefront tests locally

1. Make sure you don't have SF dev server running
   - open `localhost:3000` - should be **Unreachable**
2. Open new terminal in `fes` folder
3. Run EB mock server - `npx nx run experience-builder:mock`
4. Open another terminal in `fes` folder
5. Open Cypress test runner `npx nx run storefront-e2e:open` to run one spec / one test
   - if you want to run ALL tests in the headless mode (as they run on CI server) use `npx nx run storefront-e2e:run-headless-local`
