# Fulfillment app

## Mock server

1. Run `nx run fulfillment:init-env:mock` to init env variables for mock server.
   Variables description:
   - `ORYX_FULFILLMENT_MOCK_PROXY_URL` - the URL where proxy routes will be redirected
   - `ORYX_FULFILLMENT_MOCK_PORT` - the port on which the mock server will run (mock server runs on `3000` port if this variable is not defined)
2. Run `nx run fulfillment:mock` to start mock server.

### Proxy

Mock server can proxy requests.

- Proxy routes are defined in `mock/proxy-routes.json` file.
- Env variable `ORYX_FULFILLMENT_MOCK_PROXY_URL` is defining the URL where proxy routes will be redirected.
