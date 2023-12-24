import { TemplateResult, html } from 'lit';
import { LayoutPluginRenderParams } from '../../layout.plugin';

export const renderLabel = (
  data: LayoutPluginRenderParams,
  slot: string,
  tabindex = 0
): TemplateResult | void => {
  const hasBucket = data.experience?.components?.find(
    (c) => c.bucket === 'label'
  );

  const label = data.experience?.name;

  if (!hasBucket) {
    return html`<span .slot=${slot} .tabindex=${tabindex}>${label}</span>`;
  }

  return html`
    <oryx-composition
      bucket="label"
      .slot=${slot}
      .uid=${data.experience?.id}
      .options=${{}}
      .tabindex=${tabindex}
    ></oryx-composition>
  `;
};
