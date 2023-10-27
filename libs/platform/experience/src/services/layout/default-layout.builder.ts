import { INJECTOR, inject } from '@spryker-oryx/di';
import { Breakpoint } from '@spryker-oryx/utilities';
import { Observable, of } from 'rxjs';
import {
  Component,
  CompositionProperties,
  StyleProperties,
  StyleRuleSet,
} from '../../models';
import { LayoutBuilder } from './layout.builder';
import { LayoutStylesOptions, LayoutStylesProperties } from './layout.model';
import {
  LayoutPlugin,
  LayoutPluginType,
  LayoutStylePlugin,
  LayoutStyleProperties,
  LayoutStylePropertiesArr,
} from './plugins';
import { ScreenService } from './screen.service';

/**
 * @deprecated will be removed since 1.2.
 */
export const layoutKeys: (keyof LayoutStylesProperties)[] = [
  'sticky',
  'bleed',
  'overlap',
  'divider',
  'vertical',
];

export class DefaultLayoutBuilder implements LayoutBuilder {
  constructor(
    protected screenService = inject(ScreenService),
    protected stylePlugins = inject(LayoutStylePlugin),
    protected injector = inject(INJECTOR)
  ) {}

  collectStyles(components: Component[]): Observable<string> {
    return of(
      components
        .map((component) =>
          this.createStylesFromOptions(component.options?.rules, component.id)
        )
        .join('')
    );
  }

  createStylesFromOptions(
    rules?: StyleRuleSet[],
    id?: string
  ): Observable<string> {
    if (!rules?.length) return of('');

    return of(
      rules
        .map((rule) => {
          const styles = this.getLayoutStyles(rule);

          return styles ? this.getSelector(rule, styles, id) : '';
        })
        .join('')
    );
  }

  protected getSelector(
    rule: StyleRuleSet,
    styles: string,
    id?: string
  ): string {
    const selectors: string[] = [];
    if (id) {
      selectors.push(`:host([uid="${id}"])`);
      selectors.push(`[uid="${id}"]`);
    } else {
      selectors.push(':host');
    }

    if (rule.query?.childs) {
      selectors.forEach((_, i) => (selectors[i] += ' > *'));
    }

    if (rule.query?.hover) {
      selectors.forEach((_, i) => (selectors[i] += ':hover'));
    }

    if (rule.query?.breakpoint) {
      const mediaQuery = this.screenService.getScreenMedia(
        rule.query.breakpoint as Breakpoint
      );
      return `${mediaQuery}{\n${selectors.join(', ')} {\n${styles}\n}}`;
    } else {
      return `${selectors.join(', ')} {\n${styles}\n}`;
    }
  }

  // TODO: drop it
  getLayoutMarkers(data?: CompositionProperties): string | undefined {
    const markerPrefix = 'layout-';

    return data?.rules?.reduce((acc, ruleSet) => {
      if (!ruleSet?.layout) return acc;

      const ruleMarkers =
        typeof ruleSet.layout === 'object'
          ? Object.keys(ruleSet.layout ?? {}).reduce((acc, key) => {
              const value = (ruleSet.layout as LayoutStylesOptions)?.[
                key as keyof LayoutStylesOptions
              ];

              if (!value || key === 'type') return acc;

              const breakpoint = ruleSet.query?.breakpoint;
              const markerKey = breakpoint
                ? `${markerPrefix}${breakpoint}-${key}`
                : `${markerPrefix}${key}`;

              return `${acc} ${
                typeof value === 'boolean'
                  ? markerKey
                  : `${markerKey}="${value}"`
              }`;
            }, '')
          : '';

      return `${acc}${ruleMarkers}`;
    }, '');
  }

  protected getLayoutStyles(data?: StyleProperties): string | undefined {
    let styles = this.getProperties(data).join(';');
    if (data?.style) styles += `;${data.style}`;
    return styles === '' ? undefined : styles;
  }

  protected getProperties(data?: StyleProperties): string[] {
    const rules: string[] = [];

    if (!data) return rules;

    const layoutData =
      typeof data.layout === 'string' ? { type: data.layout } : data.layout;
    const pluginData = {
      ...data,
      layout: layoutData,
    };

    const addUnit = (value: string | number | undefined, unit?: string) => {
      return `${value}${unit ?? 'px'}`;
    };

    const add = (
      rulesObj: { [key: string]: string | number | undefined },
      options?: { unit?: string; omitUnit?: boolean; emptyValue?: boolean }
    ) => {
      Object.entries(rulesObj).forEach(([rule, value]) => {
        if ((!value || value === '0') && !options?.emptyValue) return;
        if (!isNaN(Number(value))) {
          if (!options?.omitUnit) {
            value = addUnit(value, options?.unit);
          } else {
            value = String(value);
          }
        }

        // do not add empty values unless explicitly asked
        if (!value) return;

        rules.push(`${rule}: ${value}`);
      });
    };

    const addProps = (props: LayoutStyleProperties = []) => {
      if (props && !Array.isArray(props)) {
        add(props);

        return;
      }

      for (const [rules, options] of props as LayoutStylePropertiesArr) {
        if (props) add(rules, options);
      }
    };

    for (const plugin of this.stylePlugins) {
      addProps(plugin.getStyleProperties?.(pluginData));
    }

    if (layoutData) {
      for (const [key, value] of Object.entries(layoutData)) {
        const token = key === 'type' ? value : key;
        const type =
          key === 'type' ? LayoutPluginType.Layout : LayoutPluginType.Property;

        const plugin = this.injector.inject<LayoutPlugin | null>(
          `${type}${token}`,
          null
        );

        addProps(plugin?.getStyleProperties?.(pluginData));
      }
    }

    return rules;
  }
}
