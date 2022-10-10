import {
  BreakpointService,
  Component,
  CompositionLayout,
  CompositionProperties,
  StyleProperties,
  StyleRuleSet,
} from '@spryker-oryx/experience';
import { inject } from '@spryker-oryx/injector';
import { CSSResult } from 'lit';
import { Breakpoint } from './constants';
import { LayoutBuilder } from './layout.builder';

type BreakpointStyles = {
  [B in Breakpoint]?: CSSResult | CSSResult[] | string;
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
        add(component.id, breakpoint, styles);
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

    add('--oryx-layout-margin', data.margin);
    add('--oryx-layout-padding', data.padding);
    add('border', data.border);
    add('border-radius', data.radius);
    add('background', data.background);
    add('top', data.top);
    add('bottom', data.bottom);

    add('--oryx-layout-height', data.height);
    // add('height', data.height);

    if (data.columnCount) {
      add('--oryx-layout-item-count', data.columnCount.toString());
    }

    if (data.span) {
      add('--oryx-layout-span', data.span.toString());
    }

    if (data.width) {
      // width is explicitly set to accommodate flex box systems
      add('--oryx-layout-item-width', data.width);
      add('flex', `0 0 ${data.width}`);
    }

    return styles;
  }
}
