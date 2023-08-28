declare const __ORYX_FEATURE_VERSION__: string;

// this one should be adjusted per major version
const defaultVersion = '1.0';

export const featureVersion =
  typeof __ORYX_FEATURE_VERSION__ !== 'undefined'
    ? __ORYX_FEATURE_VERSION__ || defaultVersion
    : defaultVersion;
