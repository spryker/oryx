import { inject } from '@spryker-oryx/di';
import {
  CompositionProperties,
  LayoutStylesProperties,
  StyleProperties,
  StyleRuleSet,
} from '../../models';
import { Component } from '../experience';
import { LayoutBuilder } from './layout.builder';
import { ScreenService } from './screen.service';

export const layoutKeys: (keyof LayoutStylesProperties)[] = [
  'sticky',
  'bleed',
  'overlap',
  'divider',
  'vertical',
];

export class DefaultLayoutBuilder implements LayoutBuilder {
  constructor(protected screenService = inject(ScreenService)) {}

  collectStyles(components: Component[]): string {
    return components
      .map((component) =>
        component.options?.data
          ? this.createStylesFromOptions(
              component.options.data.rules,
              component.id
            )
          : ''
      )
      .join('');
  }

  createStylesFromOptions(rules?: StyleRuleSet[], id?: string): string {
    if (!rules?.length) return '';
    return rules
      .map((rule) => {
        const styles = this.getLayoutStyles(rule);
        return styles ? this.getSelector(rule, styles, id) : '';
      })
      .join('');
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
        rule.query.breakpoint
      );
      return `${mediaQuery}{\n${selectors.join(', ')} {\n${styles}\n}}`;
    } else {
      return `${selectors.join(', ')} {\n${styles}\n}`;
    }
  }

  getLayoutMarkers(data?: CompositionProperties): string | undefined {
    const markerPrefix = 'layout-';

    return data?.rules?.reduce((acc, ruleSet) => {
      if (!ruleSet) return acc;

      const ruleMarkers = layoutKeys.reduce((acc, key) => {
        const value = ruleSet[key];

        if (!value) return acc;

        const breakpoint = ruleSet.query?.breakpoint;
        const markerKey = breakpoint
          ? `${markerPrefix}${breakpoint}-${key}`
          : `${markerPrefix}${key}`;

        return `${acc} ${
          typeof value === 'boolean' ? markerKey : `${markerKey}="${value}"`
        }`;
      }, '');

      return `${acc}${ruleMarkers}`;
    }, '');
  }

  getLayoutStyles(data?: StyleProperties): string | undefined {
    let styles = this.getProperties(data).join(';');
    if (data?.style) styles += `;${data.style}`;
    return styles === '' ? undefined : styles;
  }

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

    if (data.typo) {
      add({ 'font-size': `var(--oryx-typography-${data.typo}-size)` });
      add({ 'font-weight': `var(--oryx-typography-${data.typo}-sizeweight)` });
      add({ 'font-height': `var(--oryx-typography-${data.typo}-line)` });
      add({ margin: `0` }); // TODO: only when there's no margin
    }

    return rules;
  }

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
