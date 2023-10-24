# Fulfillment app

## App

1. Set environment variables for Fulfillment App.
   Variables description:
   - `ORYX_FULFILLMENT_BACKEND_URL` - the url where the backend is hosted.
   - `ORYX_FULFILLMENT_PUBLIC_VAPID_KEY` - the public VAPID key to make the application able to subscribe push notifications.
   - `ORYX_LABS` - the boolean indicator to let Fulfillment app know if it should use `labs` features
   - `ORYX_FULFILLMENT_CLIENT_ID` - the client id for the OAuth flow
2. Run `nx run fulfillment:serve` to start the app in development mode.

