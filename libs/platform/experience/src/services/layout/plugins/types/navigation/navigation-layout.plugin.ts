import { ssrAwaiter } from '@spryker-oryx/core/utilities';
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

        // const navigationType =
        //   options.navigationType === 'flyout' ? m.flyoutStyles : css``;

        // const dropdown =
        //   options.navigationType === 'dropdown' ? m.dropdownStyles : css``;

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
    // console.log(data);
    return of();
    // if (data.options.navigationType !== 'dropdown') {
    //   return of(undefined);
    // }
    // console.log(data.experience?.id);

    // return of({
    //   post: html`<oryx-composition
    //       .uid=${data.experience?.id}
    //     ></oryx-composition>
    //     <style>
    //       oryx-composition {
    //         outline: solid 1px red;
    //         /* position: absolute; */
    //       }
    //     </style>`,
    // });
  }
}
