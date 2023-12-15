import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { html } from 'lit';
import { Observable, of } from 'rxjs';
import { LayoutStyles } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
  LayoutPluginRender,
  LayoutPluginRenderParams,
} from '../../layout.plugin';

export class NavigationLayoutPlugin implements LayoutPlugin {
  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    const { options } = data;

    return ssrAwaiter(
      import('./navigation-layout.styles').then((m) => {
        const direction = options.vertical
          ? m.verticalStyles
          : m.horizontalStyles;

        // TODO: only load dropdown styles if one of the components requires dropdown
        // const dropdownStyles = data.options.dropdown ? m.dropdownStyles : '';

        return {
          styles: `${m.styles.styles}${direction}`,
        };
      })
    );
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./navigation-layout.schema').then((m) => m.schema),
    });
  }

  getRender(
    data: LayoutPluginRenderParams
  ): Observable<LayoutPluginRender | undefined> {
    const itemLayout = data.experience?.options?.rules?.[0]?.layout as
      | LayoutProperty
      | undefined;

    if (!itemLayout?.dropdown) return of();

    return of({
      inner: html`<oryx-dropdown
        .position=${itemLayout.dropdownPosition}
        ?vertical-align=${itemLayout.dropdownVerticalAlign}
      >
        <span slot="trigger"> ${data.template}</span>
        <oryx-composition
          style="--oryx-popover-border-radius: 0;
              --oryx-content-link-padding: 0 0 0 12px;
              --oryx-link-padding: 8px 12px 8px 0;
              --oryx-link-hover-background: var(--oryx-color-neutral-3);
              --oryx-link-active-background: var(--oryx-color-primary-5);
              --oryx-link-hover-shadow: none;
              --oryx-link-active-shadow: none;
              --oryx-link-current-shadow: none;
              --oryx-link-current-color: var(--oryx-color-primary-9);"
          .uid=${data.experience?.id}
          close-popover
        ></oryx-composition>
      </oryx-dropdown>`,
    });
  }
}
