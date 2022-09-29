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
      perBreakpoint[breakpoint] += `[uid=${id}]{${rules}}`;
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
    add('layout-carousel', ruleSet.layout === CompositionLayout.carousel);
    add('layout-column', ruleSet.layout === CompositionLayout.column);
    add(`column-count-${ruleSet.columnCount}`, !!ruleSet.columnCount);
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

    add('gap', data.gap);
    add('padding', data.padding);
    add('margin', data.margin);
    add('border', data.border);
    add('border-radius', data.radius);
    add('background', data.background);
    add('top', data.top);
    add('bottom', data.bottom);

    // TODO: consider dropping the CSS variable to avoid inheritance in descendant components
    add('--height', data.height);

    // col span is used in grid systems, so that a grid item can span multiple columns
    if (data.gridColSpan && data.gridColSpan > 0) {
      add('grid-column', `span ${data.gridColSpan}`);
    }

    if (data.width) {
      // both width and flex are explicitly set to accommodate grid and flex box systems
      // TODO: consider to subtract the gap-size
      add('width', data.width);
      add('flex', `0 0 ${data.width}`);
    }

    return styles;
  }
}
