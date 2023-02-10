/**
 * Provides a lifecycle hook that is invoked when the service is destroyed. This is useful for
 * cleanup purposes.
 */
export interface OnDestroy {
  onDestroy(): void;
}
