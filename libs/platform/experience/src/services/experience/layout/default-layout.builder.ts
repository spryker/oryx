import { ThemeBreakpoints, ThemeStyles } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
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
      rule: string,
      value: string | number | undefined,
      options?: { omitUnit?: boolean; addEmpty?: boolean; unit?: string }
    ) => {
      if (!value) return;

      if (!isNaN(Number(value))) {
        if (!options?.omitUnit) {
          value = addUnit(value, options?.unit);
        } else if (value === 0 && !options?.addEmpty) {
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
    };

    add('--cols', data.columnCount, { omitUnit: true });
    add('--span', data.span, { omitUnit: true });
    add('--gap', data.gap);
    add('margin-inline', data.marginInline);
    add('margin-block', data.marginBlock);
    add('--padding-inline', data.paddingInline);
    add('padding-block', data.paddingBlock);
    add('--top', data.top);
    add('--width', data.width);
    if (data.width) {
      add('--flex', `0 0 min(100%, ${addUnit(data.width)})`);
    }

    add('--height', data.height);
    add('border', data.border);
    add('border-radius', data.radius);
    add('background', data.background);
    add('--z-index', data.zIndex, { omitUnit: true });
    add('--grid-column', data.gridColumn, { omitUnit: true });
    add('--grid-row', data.gridRow, { omitUnit: true });
    add('--align-items', data.align);
    add('--rotate', data.rotate, { unit: 'deg' });
    add('overflow', data?.overflow);

    return rules;
  }
}
