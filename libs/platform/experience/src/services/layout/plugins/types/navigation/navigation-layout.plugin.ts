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
        const dropdownStyles = m.dropdownStyles;

        return {
          styles: `${m.styles.styles}${direction}${dropdownStyles}`,
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
    const isDropdown =
      data.options.navigationType === 'dropdown' ||
      data.experience?.options?.rules?.find(
        (rule) => (rule.layout as Layouts)?.navigationType === 'dropdown'
      );

    if (isDropdown) {
      return of({
        wrapper: html`<oryx-dropdown vertical-align position="start">
          <span slot="trigger">${data.template}</span>
          <oryx-composition
            .uid=${data.experience?.id}
            close-popover
            .options=${{ rules: [{ layout: { type: 'list' }, gap: '0px' }] }}
          ></oryx-composition>
        </oryx-dropdown>`,
      });
    }

    return of();
  }
}
