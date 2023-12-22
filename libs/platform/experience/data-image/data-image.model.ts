import { DataFieldComponentOptions } from '../src/models';

export interface DataImageComponentOptions extends DataFieldComponentOptions {
  /**
   * Indicates whether a fallback image should be rendered if the image is not available.
   */
  renderFallback?: boolean;
}
