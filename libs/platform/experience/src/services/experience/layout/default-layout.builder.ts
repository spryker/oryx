import { ThemeBreakpoints, ThemeStyles } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { colorPalette } from '@spryker-oryx/themes/design-tokens';
import {
  Breakpoint,
  CompositionProperties,
  StyleProperties,
  StyleRuleSet,
} from '../../../models';
import { Component } from '../models';
import { BreakpointService } from './breakpoint.service';
import { LayoutBuilder } from './layout.builder';

type BreakpointStyles = {
  [B in keyof ThemeBreakpoints]?: ThemeStyles;
};

export class DefaultLayoutBuilder implements LayoutBuilder {
  constructor(protected breakpointService = inject(BreakpointService)) {}

  collectStyles(components: Component[]): string {
    const perBreakpoint: BreakpointStyles = {};

    const add = (
      id: string,
      breakpoint: Breakpoint,
      rules: string | undefined
    ): void => {
      if (!rules || rules === '') return;

      if (!perBreakpoint[breakpoint]) {
        perBreakpoint[breakpoint] = '';
      }
      perBreakpoint[breakpoint] += `[uid="${id}"]{${rules}}`;
    };

    components.forEach((component) => {
      component.options?.data?.rules?.forEach((rule) => {
        const styles = this.getLayoutStyles(rule);
        const breakpoint =
          rule.breakpoint ?? this.breakpointService.getSmallest();

        if (breakpoint) {
          add(component.id, breakpoint, styles);
        }
      });
    });

    return Object.keys(perBreakpoint)
      .map((key) => {
        const query = this.breakpointService.getMediaQuery(key as Breakpoint);
        const stylesForBreakpoint = perBreakpoint[key as Breakpoint];
        if (query) {
          return `${query}{${stylesForBreakpoint}}\n`;
        } else {
          return `${stylesForBreakpoint}\n`;
        }
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
    const styles = this.getProperties(data).join(';');
    return styles === '' ? undefined : styles;
  }

  /**
   * Populates an array of classes based on the layout properties provided
   * in the data.
   */
  protected getClasses(ruleSet?: StyleRuleSet): string[] {
    const classes: string[] = [];
    if (!ruleSet) {
      return classes;
    }

    const add = (className: string, required = false): void => {
      const breakpoint =
        ruleSet.breakpoint ?? this.breakpointService.getSmallest();
      if (required) classes.push(`${breakpoint}-${className}`);
    };

    add('maxWidth', ruleSet.maxWidth);
    add('sticky', ruleSet.sticky);

    return classes;
  }

  protected getProperties(data?: StyleProperties): string[] {
    const rules: string[] = [];

    if (!data) {
      return rules;
    }

    const addUnit = (value: string | number | undefined, unit?: string) => {
      return `${value}${unit ?? 'px'}`;
    };

    const add = (
      rulesObj: { [key: string]: string | number | undefined },
      options?: { omitUnit?: boolean; addEmpty?: boolean; unit?: string }
    ) => {
      Object.entries(rulesObj).forEach(([rule, value]) => {
        if (!value) return;

        if (!isNaN(Number(value))) {
          if (!options?.omitUnit) {
            value = addUnit(value, options?.unit);
          } else if (value === 0 && options?.addEmpty) {
            value = '';
          } else {
            value = String(value);
          }
        }

        // do not add empty values unless explicitly asked
        if (!value && !options?.addEmpty) {
          return;
        }

        rules.push(`${rule}: ${value}`);
      });
    };

    add(
      {
        '--cols': data.columnCount,
        '--grid-column': data.gridColumn,
        '--grid-row': data.gridRow,
        '--span': data.span,
        '--z-index': data.zIndex,
        '--rotate': data.rotate,
      },
      { omitUnit: true }
    );

    add({
      '--align-items': data.align,
      '--gap': data.gap,
      '--top': data.top,
      '--width': data.width,
      '--height': data.height,
      margin: data.margin,
      border: data.border,
      'border-radius': data.radius,
      background: data.background,
      overflow: data?.overflow,
    });

    add({ '--rotate': data.rotate }, { unit: 'deg' });

    if (data.padding) {
      add({
        padding: data.padding,
        '--scroll-start': this.findCssValue(data.padding, 'start'),
      });
    }

    // TODO: move logic out of layout builder to style or color builder
    const colorize = (type: string, color: string): void => {
      add({ [`--oryx-color-${type}-0`]: colorPalette?.[color]?.['dark']?.[0] });
      let legacyType = type;
      if (type === 'brand') legacyType = 'primary';
      if (type === 'accent') legacyType = 'secondary';

      add({
        [`--oryx-color-${legacyType}-100`]:
          colorPalette?.[color]?.['dark']?.[3],
      });
      add({
        [`--oryx-color-${legacyType}-200`]:
          colorPalette?.[color]?.['dark']?.[5],
      });
      add({
        [`--oryx-color-${legacyType}-300`]:
          colorPalette?.[color]?.['dark']?.[9],
      });
      add({
        [`--oryx-color-${legacyType}-400`]:
          colorPalette?.[color]?.['dark']?.[10],
      });
      add({
        [`--oryx-color-${legacyType}-500`]:
          colorPalette?.[color]?.['dark']?.[11],
      });
    };

    if (data.primaryColor) {
      colorize('brand', data.primaryColor);
    }
    if (data.secondaryColor) {
      colorize('accent', data.secondaryColor);
    }
    if (data.neutralColor) {
      colorize('neutral', data.neutralColor);
    }

    return rules;
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
