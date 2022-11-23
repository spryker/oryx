1. Install verdaccio
   `npm install -g verdaccio@5.14.0` // later versions have issues with post/pre/installation
2. Run verdaccio
   ```
   verdaccio
   warn --- config file  - /home/.config/verdaccio/config.yaml
   warn --- http address - http://localhost:4873/ - verdaccio/5.0.0
   ```
3. Add a user to verdaccio registry (or login with it if it’s already created):
   `npm adduser --registry http://localhost:4873/`
4. Build packages (tarballs) and publish to verdaccio registry.
   `node tools/packages/generate.js`

Packages are available from verdaccio registry:
`npm i @spryker-oryx/core --registry http://localhost:4873`
