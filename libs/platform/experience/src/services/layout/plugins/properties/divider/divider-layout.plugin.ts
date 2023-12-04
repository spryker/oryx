import { ssrAwaiter } from '@spryker-oryx/core/utilities';
import { featureVersion } from '@spryker-oryx/utilities';
import { Observable, of, switchMap } from 'rxjs';
import { LayoutStyles, LayoutStylesOptions } from '../../../layout.model';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginOptionsParams,
} from '../../layout.plugin';

export class DividerLayoutPlugin implements LayoutPlugin {
  getStyles(data: LayoutPluginOptionsParams): Observable<LayoutStyles> {
    return this.getDefaultProperties().pipe(
      switchMap((defaultOptions) => {
        const options = { ...defaultOptions, ...data.options };
        return ssrAwaiter(
          import('./divider.styles').then((m) => {
            if (featureVersion < '1.4') {
              if (!options.vertical) return m.styles;
              return {
                ...m.styles,
                styles: `${m.styles.styles}${m.verticalStyles.styles}`,
              };
            }

            let styles = `${m.commonStyle}`;

            if (options.dividerColor)
              styles += `:host {--oryx-divider-color: ${options.dividerColor};}`;
            if (options.dividerWidth)
              styles += `:host {--oryx-divider-width: ${options.dividerWidth};}`;
            if (options.dividerStyle)
              styles += `:host {--oryx-divider-style: ${options.dividerStyle};}`;

            if (options.dividerInBetween && !options.vertical)
              styles += m.horizontalInBetweenStyles;
            if (options.dividerInBetween && options.vertical)
              styles += m.verticalInBetweenStyles;
            if (options.dividerBefore && !options.vertical)
              styles += m.beforeHorizontalStyles;
            if (options.dividerBefore && options.vertical)
              styles += m.beforeVerticalStyles;
            if (options.dividerAfter && !options.vertical)
              styles += m.afterHorizontalStyles;
            if (options.dividerAfter && options.vertical)
              styles += m.afterVerticalStyles;

            return {
              styles: `${styles}`,
            };
          })
        );
      })
    );
  }

  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./divider-layout.schema').then((m) => m.schema),
    });
  }

  /**
   * @override sets the in between divider to true by default.
   */
  getDefaultProperties(): Observable<LayoutStylesOptions> {
    return of({ dividerInBetween: true });
  }
}
