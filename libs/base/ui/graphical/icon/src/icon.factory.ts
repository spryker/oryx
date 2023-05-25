import { html, TemplateResult } from 'lit';
import { Icon } from './icon.model';

/**
 * Creates an IconComponent based on the given icon model.
 *
 * @param icon an object that instruments how the icon is constructed.
 * @returns `<oryx-icon>` component with the requested SVG icon.
 */
export const icon = (icon: Icon): TemplateResult => {
  if (icon.source) {
    return html`<oryx-icon
      ><svg viewBox="0 0 24 24">${icon.source}</svg></oryx-icon
    >`;
  }

  return html`<oryx-icon
    .size=${icon.size}
    .type=${icon.type}
    .sprite=${icon.sprite}
  ></oryx-icon>`;
};
