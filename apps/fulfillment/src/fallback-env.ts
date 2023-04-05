export const fallbackEnv = {
  ORYX_FULFILLMENT_BACKEND_URL: `${
    (typeof globalThis !== 'undefined' && globalThis.location.origin) ||
    'https://dev-fulfillment.netlify.app'
  }/.netlify/functions/server`,
};
