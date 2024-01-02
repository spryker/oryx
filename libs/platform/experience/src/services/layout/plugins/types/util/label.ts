import { Component } from '@spryker-oryx/experience';
import { TemplateResult, html } from 'lit';
import { LayoutPluginRenderParams } from '../../layout.plugin';

export const renderLabelSlot = (
  data: LayoutPluginRenderParams,
  slotName: string,
  tabindex = 0
): TemplateResult | void => {
  const hasBucket = !!(
    data.experience?.components as Record<string, Component[]>
  )?.label;

  if (!hasBucket) {
    const label = data.experience?.name;
    if (!label) return;
    return html`<span .slot=${slotName} tabindex=${tabindex}>${label}</span>`;
  }

  return html`
    <oryx-composition
      bucket="label"
      .slot=${slotName}
      .uid=${data.experience?.id}
      .options=${{}}
      tabindex=${tabindex}
    ></oryx-composition>
  `;
};
