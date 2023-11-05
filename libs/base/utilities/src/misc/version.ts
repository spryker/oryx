declare const __ORYX_FEATURE_VERSION__: string;

// this one should be adjusted per major version
const defaultVersion = 'latest';

export const featureVersion =
  typeof __ORYX_FEATURE_VERSION__ !== 'undefined'
    ? __ORYX_FEATURE_VERSION__ || defaultVersion
    : defaultVersion;
