import { LayoutPlugin } from '../../layout.plugin';

export const AccordionLayoutPluginToken = `${LayoutPlugin}accordion`;

declare global {
  export interface Layouts {
    accordion: undefined;
  }

  export interface LayoutProperty {
    /**
     * If true, multiple accordion items can be expanded at the same time.
     *
     * Power users can use the option key to expand or collapse all items at once.
     */
    accordionMultiExpand?: boolean;
  }
}
