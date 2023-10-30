import { INJECTOR, inject } from '@spryker-oryx/di';
import { Breakpoint } from '@spryker-oryx/utilities';
import { Observable, concatMap, from, map, merge, of, reduce } from 'rxjs';
import {
  Component,
  CompositionProperties,
  StyleProperties,
  StyleRuleSet,
} from '../../models';
import { LayoutBuilder } from './layout.builder';
import { LayoutStylesOptions } from './layout.model';
import {
  LayoutPlugin,
  LayoutPropertyPlugin,
  LayoutStyleList,
  LayoutStyleOptions,
  LayoutStylePlugin,
  LayoutStyleProperties,
  LayoutStylePropertiesArr,
} from './plugins';
import { ScreenService } from './screen.service';

/**
 * @deprecated since 1.2. Will be deleted.
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
    protected stylePlugins = inject(LayoutStylePlugin, []),
    protected injector = inject(INJECTOR)
  ) {}

  getCompositionStyles(components: Component[]): Observable<string> {
    return from(components).pipe(
      concatMap((component) =>
        this.getStylesFromOptions(component.options?.rules, component.id)
      ),
      reduce((acc, curr) => `${acc}${curr}`, '')
    );
  }

  getStylesFromOptions(
    rules?: StyleRuleSet[],
    id?: string
  ): Observable<string> {
    if (!rules?.length) return of('');

    return from(rules).pipe(
      concatMap((rule) =>
        this.getRuleStyles(rule).pipe(
          map((styles) => (styles ? this.getSelector(rule, styles, id) : ''))
        )
      ),
      reduce((acc, curr) => `${acc}${curr}`, '')
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

  /**
   * @deprecated since 1.2. Will be deleted.
   */
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

  protected getRuleStyles(
    data?: StyleProperties
  ): Observable<string | undefined> {
    return merge(...this.getStyleProperties(data)).pipe(
      map((props) => {
        let styles = this.convertProperties(props).join(';');
        if (data?.style) styles += `;${data.style}`;
        return styles === '' ? undefined : styles;
      })
    );
  }

  protected getStyleProperties(
    data?: StyleProperties
  ): Observable<LayoutStyleProperties>[] {
    if (!data) return [];

    const observables: Observable<LayoutStyleProperties>[] = [];
    const layoutData =
      typeof data.layout === 'string' ? { type: data.layout } : data.layout;
    const pluginData = {
      ...data,
      layout: layoutData,
    };

    for (const plugin of this.stylePlugins) {
      const observable = plugin.getStyleProperties?.(pluginData);

      if (observable) observables.push(observable);
    }

    if (!layoutData) {
      return observables;
    }

    for (const [key, value] of Object.entries(layoutData)) {
      const token = key === 'type' ? value : key;
      const type = key === 'type' ? LayoutPlugin : LayoutPropertyPlugin;
      const plugin = this.injector.inject<LayoutPlugin | null>(
        `${type}${token}`,
        null
      );
      const observable = plugin?.getStyleProperties?.(pluginData);

      if (observable) observables.push(observable);
    }

    return observables;
  }

  protected convertProperties(props: LayoutStyleProperties = []): string[] {
    const rules: string[] = [];

    const addUnit = (value: string | number | undefined, unit?: string) => {
      return `${value}${unit ?? 'px'}`;
    };

    const add = (rulesObj: LayoutStyleList, options?: LayoutStyleOptions) => {
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

    if (props && !Array.isArray(props)) {
      add(props);

      return rules;
    }

    for (const [rules, options] of props as LayoutStylePropertiesArr) {
      if (props) add(rules, options);
    }

    return rules;
  }

  /**
   * @deprecated since 1.2. Will be deleted, use `getCompositionStyles` instead.
   */
  collectStyles(components: Component[]): string {
    return components
      .map((component) =>
        this.createStylesFromOptions(component.options?.rules, component.id)
      )
      .join('');
  }

  /**
   * @deprecated since 1.2. Will be deleted, use `getStyles` instead.
   */
  createStylesFromOptions(rules?: StyleRuleSet[], id?: string): string {
    if (!rules?.length) return '';
    return rules
      .map((rule) => {
        const styles = this.getLayoutStyles(rule);
        return styles ? this.getSelector(rule, styles, id) : '';
      })
      .join('');
  }

  /**
   * @deprecated since 1.2. Will be deleted. Use getStyleProperties instead.
   */
  getLayoutStyles(data?: StyleProperties): string | undefined {
    let styles = this.getProperties(data).join(';');
    if (data?.style) styles += `;${data.style}`;
    return styles === '' ? undefined : styles;
  }

  /**
   * @deprecated since 1.2. Will be deleted. Use protected getRuleStyles instead.
   */
  protected getProperties(data?: StyleProperties): string[] {
    const rules: string[] = [];

    if (!data) return rules;

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

    add({ '--oryx-column-count': data.columnCount }, { omitUnit: true });

    if (data.padding) {
      add({ 'scroll-padding': this.findCssValue(data.padding, 'start') });
      add({
        'padding-block': this.findCssValues(data.padding, 'top', 'bottom'),
      });
      if (!data.bleed) {
        // consider moving to bleed layout plugin
        // avoid adding padding for layouts that bleed into the side
        // as this can harm the calculated width
        add({
          'padding-inline': this.findCssValues(data.padding, 'start', 'end'),
        });
      }

      // nested padding is usedd to calculate the size of nested grid based elements
      add({
        '--inline-padding': this.findCssValues(data.padding, 'start', 'end'),
      });
    }

    add({ rotate: data.rotate }, { unit: 'deg' });
    add({ 'z-index': data.zIndex }, { omitUnit: true });

    if (data.gridColumn && data.colSpan) {
      add({ 'grid-column': `${data.gridColumn} / span ${data.colSpan}` });
    } else {
      if (data.gridColumn)
        add({ 'grid-column': data.gridColumn }, { omitUnit: true });
      if (data.colSpan) add({ 'grid-column': `span ${data.colSpan}` });
    }
    if (data.gridRow && data.rowSpan) {
      add({ 'grid-row': `${data.gridRow} / span ${data.rowSpan}` });
    } else {
      if (data.gridRow) add({ 'grid-row': data.gridRow }, { omitUnit: true });
      if (data.rowSpan) add({ 'grid-row': `span ${data.rowSpan}` });
    }

    const gaps = data.gap?.toString().split(' ');
    add({ '--column-gap': gaps?.[1] ?? gaps?.[0] }, { emptyValue: true });
    add({ '--row-gap': gaps?.[0] }, { emptyValue: true });

    if (data.sticky) {
      add({
        'max-height': `calc(${data.height ?? '100vh'} - ${data.top ?? '0px'})`,
      });
    }

    add({
      '--align': data.align,
      '--justify': data.justify,
      'inset-block-start': data.top,
      height: data.height,
      width: data.width,
      margin: data.margin,
      border: data.border,
      'border-radius': data.radius,
      background: data.background,
      '--oryx-fill': data.fill,
      'aspect-ratio': data.ratio,
      overflow: data?.overflow,
    });

    if (data.scale) {
      add({ transform: `scale(${data?.scale})` });
    }

    if (data.typography) {
      add({ 'font-size': `var(--oryx-typography-${data.typography}-size)` });
      add({
        'font-weight': `var(--oryx-typography-${data.typography}-weight)`,
      });
      add({ 'line-height': `var(--oryx-typography-${data.typography}-line)` });
      if (!data.margin) {
        add({ margin: `0` }, { emptyValue: true });
      }
    }

    return rules;
  }

  /**
   * @deprecated since 1.2. Will be deleted. Use import from layout.utilities
   */
  protected findCssValues(
    data: string,
    startPos: 'start' | 'top',
    endPos: 'end' | 'bottom'
  ): string | undefined {
    const start = this.findCssValue(data, startPos);
    const end = this.findCssValue(data, endPos);
    if (!start && !end) return;
    if (start === end) return start;
    return `${start ?? 'auto'} ${end ?? 'auto'}`;
  }

  /**
   * Extracts a specified position value from a given string.
   *
   * @param data - A string representing CSS values, with each value separated by a space.
   * @param pos - The position to extract the value for, one of: 'top', 'end', 'bottom', or 'start'.
   * @returns The extracted value or `undefined` if the position is not found.
   *
   * @example
   * const padding = '10px 5px 20px';
   * findCssValue(padding, 'top'); // '10px'
   * findCssValue(padding, 'end'); // '5px'
   * findCssValue(padding, 'bottom'); // '20px'
   * findCssValue(padding, 'start'); // '5px'
   *
   * @deprecated since 1.2. Will be deleted. Use import from layout.utilities
   */
  protected findCssValue(
    data: string,
    pos: 'top' | 'bottom' | 'start' | 'end'
  ): string | undefined {
    const positions = data.split(' ');
    switch (pos) {
      case 'top':
        return positions[0];
      case 'end':
        return positions[1] ?? positions[0];
      case 'bottom':
        return positions[2] ?? positions[0];
      case 'start':
        return positions[3] ?? positions[1] ?? positions[0];
    }
  }
}
