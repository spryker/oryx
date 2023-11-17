declare const __ORYX_FEATURE_VERSION__: string;

// this one should be adjusted per major version
const defaultVersion = '1.0';

interface ImportMeta {
  readonly env?: Record<string, string | undefined>;
}

console.log(__ORYX_FEATURE_VERSION__);
console.log(defaultVersion);
console.log((import.meta as ImportMeta)?.env?.ORYX_FEATURE_VERSION);

export const featureVersion =
  typeof __ORYX_FEATURE_VERSION__ !== 'undefined'
    ? __ORYX_FEATURE_VERSION__ || defaultVersion
    : (import.meta as ImportMeta)?.env?.ORYX_FEATURE_VERSION || defaultVersion;
