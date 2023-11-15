/// <reference types="vite/client" />

declare const __ORYX_FEATURE_VERSION__: string;

// this one should be adjusted per major version
const defaultVersion = '1.0';

interface ImportMeta {
  readonly env?: Record<string, string | undefined>;
}

export const featureVersion =
  typeof __ORYX_FEATURE_VERSION__ !== 'undefined'
    ? __ORYX_FEATURE_VERSION__ || defaultVersion
    : import.meta.env.ORYX_FEATURE_VERSION || defaultVersion;
