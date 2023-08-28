declare const __ORYX_FEATURE_LEVEL__: number;

// this one should be adjusted per major version
const defaultLevel = '1.0';

export const OryxFeatureLevel =
  typeof __ORYX_FEATURE_LEVEL__ !== 'undefined'
    ? __ORYX_FEATURE_LEVEL__ || defaultLevel
    : defaultLevel;
