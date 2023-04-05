# Fulfillment app

## Mock server

Run `nx run fulfillment:serve` to start mock server.

### Proxy

Mock server can proxy requests.

- Proxy routes are defined in `mock/proxy-routes.json` file.

- Env variable `ORYX_FULFILLMENT_MOCK_PROXY_URL` is defining the URL where proxy routes will be redirected.
