# Fulfillment app

## Mock server

1. Set environment variables for mock server in `.env` file.
   Variables description:
   - `ORYX_FULFILLMENT_MOCK_PROXY_URL` - the URL where proxy routes will be redirected
   - `ORYX_FULFILLMENT_MOCK_PORT` - the port on which the mock server will run (mock server runs on `3000` port if this variable is not defined)
2. Run `nx run fulfillment:mock` to start mock server.

## Fulfillment App

1. Set environment variables for Fulfillment App.
   Variables description:
   - `ORYX_FULFILLMENT_BACKEND_URL` - the url where the backend is hosted.
   - `ORYX_FULFILLMENT_PUBLIC_VAPID_KEY` - the public VAPID key to make the application able to subscribe push notifications.
   - `ORYX_LABS` - the boolean indicator to let Fulfillment app know if it should use `labs` features
2. Run `nx run fulfillment:serve` to start the app in development mode.

### Proxy

Mock server can proxy requests. Proxy routes are defined in `mock/proxy-routes.json` file.
