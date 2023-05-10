import { inject } from '@spryker-oryx/di';
import {
  CompositionProperties,
  StyleProperties,
  StyleRuleSet,
} from '../../models';
import { Component } from '../experience';
import { LayoutBuilder } from './layout.builder';
import { ScreenService } from './screen.service';

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
    const uidSelector = id ? `:host([uid="${id}"]), [uid="${id}"]` : ':host';
    return rules
      .map((rule) => {
        const styles = this.getLayoutStyles(rule);
        if (styles) {
          const breakpoint = rule.breakpoint;
          if (breakpoint) {
            const mediaQuery = this.screenService.getScreenMedia(breakpoint);
            return `${mediaQuery}{ ${uidSelector} {${styles}}}\n`;
          }
          return `${uidSelector} {${styles}}\n`;
        } else return '';
      })
      .join('');
  }

  getLayoutClasses(data?: CompositionProperties): string | undefined {
    const ruleSets: string[] = [];
    data?.rules?.forEach((rule) => {
      ruleSets.push(...this.getClasses(rule));
    });

    if (ruleSets.length === 0) {
      return;
    }

    return ruleSets.join(' ');
  }

  getLayoutStyles(data?: StyleProperties): string | undefined {
    let styles = this.getProperties(data).join(';');
    if (data?.style) styles += data.style;
    return styles === '' ? undefined : styles;
  }

  /**
   * Populates an array of classes based on the layout properties provided
   * in the data.
   */
  protected getClasses(ruleSet?: StyleRuleSet): string[] {
    const classes: string[] = [];
    if (!ruleSet) return classes;

    const add = (className: string, required = false): void => {
      const breakpoint = ruleSet.breakpoint ?? this.screenService.getSmallest();
      if (required) classes.push(`${breakpoint}-${className}`);
    };

    add('bleed', ruleSet.bleed);
    add('sticky', ruleSet.sticky);

    return classes;
  }

  protected getProperties(data?: StyleProperties): string[] {
    const rules: string[] = [];

    if (!data) return rules;

    const addUnit = (value: string | number | undefined, unit?: string) => {
      return `${value}${unit ?? 'px'}`;
    };

    const add = (
      rulesObj: { [key: string]: string | number | undefined },
      options?: { unit?: string; omitUnit?: boolean }
    ) => {
      Object.entries(rulesObj).forEach(([rule, value]) => {
        if (!value) return;

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

    add({ '--oryx-grid-columns': data.columnCount }, { omitUnit: true });
    add(
      { '--split-column-factor': data.splitColumnFactor },
      { omitUnit: true }
    );

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
        '--nested-padding': this.findCssValues(data.padding, 'start', 'end'),
      });
    }

    add({ rotate: data.rotate }, { unit: 'deg' });
    add({ 'z-index': data.zIndex }, { omitUnit: true });

    // col/row position and span
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

    // column/row gap
    const gaps = data.gap?.toString().split(' ');
    add({ '--column-gap': gaps?.[1] ?? gaps?.[0] });
    add({ '--row-gap': gaps?.[0] });

    // consider moving to split-column layout plugin
    add(
      { '--split-column-factor': data.splitColumnFactor },
      { omitUnit: true }
    );

    // consider moving to sticky layout plugin
    if (data.sticky) {
      add({
        'max-height': `calc(${data.height ?? '100vh'} - ${data.top ?? '0px'})`,
      });
    }

    add({
      '--align': data.align,
      'inset-block-start': data.top,
      height: data.height,
      width: data.width,
      margin: data.margin,
      border: data.border,
      'border-radius': data.radius,
      background: data.background,
      overflow: data?.overflow,
    });

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
