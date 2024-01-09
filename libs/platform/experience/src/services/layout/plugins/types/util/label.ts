import { Component } from '@spryker-oryx/experience';
import { TemplateResult, html } from 'lit';
import { LayoutPluginRenderParams } from '../../layout.plugin';

export const renderLabelSlot = (
  data: LayoutPluginRenderParams,
  slotName: string
): TemplateResult | void => {
  const hasBucket = !!(
    data.experience?.components as Record<string, Component[]>
  )?.label;

  if (!hasBucket) {
    const label = data.experience?.name;
    if (!label) return;
    return html`<span .slot=${slotName} tabindex="0">${label}</span>`;
  }

  return html`
    <oryx-composition
      bucket="label"
      .slot=${slotName}
      .uid=${data.experience?.id}
      .options=${{}}
    ></oryx-composition>
  `;
};
