import { ThemeBreakpoints, ThemeStyles } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import {
  Breakpoint,
  CompositionLayout,
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
    const styles = this.getStyleProperties(data).join('');
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

    add('container', ruleSet.container);
    add('jumbotron', ruleSet.jumbotron);
    add('layout-carousel', ruleSet.layout === CompositionLayout.Carousel);
    add('layout-column', ruleSet.layout === CompositionLayout.Column);
    add('layout-grid', ruleSet.layout === CompositionLayout.Grid);
    add('sticky', ruleSet.position === 'sticky');

    add('has-margin', !!ruleSet.margin);
    add('has-padding', !!ruleSet.padding);

    return classes;
  }

  /**
   * Style properties are dynamically build and can be used for both
   * compositions and components.
   */
  protected getStyleProperties(data?: StyleProperties): string[] {
    const styles: string[] = [];
    if (!data) {
      return styles;
    }

    const add = (style: string, value?: string): void => {
      if (value) styles.push(`${style}:${value};`);
    };

    if (data.gap) {
      add('--oryx-layout-gap', data.gap);
    }

    if (data.columnCount) {
      add('--oryx-layout-item-count', data.columnCount.toString());
    }

    if (data.span) {
      add('--oryx-layout-span', data.span.toString());
    }

    add('align-items', data.align);

    add('--oryx-layout-margin', this.getRuleValue(data.margin));
    add('--oryx-layout-padding', this.getRuleValue(data.padding));
    add('--oryx-layout-height', this.getRuleValue(data.height));

    add('top', this.getRuleValue(data.top));
    add('bottom', this.getRuleValue(data.bottom));
    add('border-radius', this.getRuleValue(data.radius));
    add('border', data.border);
    add('background', data.background);
    add('--oryx-layout-item-width', this.getRuleValue(data.width));

    if (data.zIndex !== undefined) {
      add('--oryx-z-index', data.zIndex.toString());
    }

    return styles;
  }

  /**
   * Validates the given value and adds a `px` unit if no
   * unit was given.
   *
   * Returns undefined when there's no value provided.
   */

  protected getRuleValue(value?: string): string | undefined {
    if (!value) {
      return;
    }

    if (!isNaN(+value)) {
      value += 'px';
    }
    return value;
  }
}
