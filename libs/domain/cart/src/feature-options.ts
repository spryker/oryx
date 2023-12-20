export const CartFeatureOptionsKey = 'cart';
export interface CartFeatureOptionsConfig {
  multi?: boolean;
}

declare global {
  interface FeatureOptions {
    [CartFeatureOptionsKey]?: CartFeatureOptionsConfig;
  }
}
