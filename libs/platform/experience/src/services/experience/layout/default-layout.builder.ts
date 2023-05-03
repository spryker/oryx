import { inject } from '@spryker-oryx/di';
import {
  CompositionProperties,
  StyleProperties,
  StyleRuleSet,
} from '../../../models';
import { Component } from '../models';
import { LayoutBuilder } from './layout.builder';
import { ScreenService } from './screen.service';

export class DefaultLayoutBuilder implements LayoutBuilder {
  constructor(protected screenService = inject(ScreenService)) {}

  collectStyles(components: Component[]): string {
    return components
      .map((component) =>
        component.options?.data
          ? this.createStylesFromOptions(
              component.id,
              component.options.data.rules
            )
          : ''
      )
      .join('');
  }

  createStylesFromOptions(id: string, rules?: StyleRuleSet[]): string {
    return (
      rules
        ?.map((rule) => {
          const styles = this.getLayoutStyles(rule);
          if (styles) {
            const breakpoint = rule.breakpoint;
            if (breakpoint) {
              const query = this.screenService.getScreenMedia(breakpoint);
              return `${query}{:host([uid="${id}"]), [uid="${id}"] {${styles}}}\n`;
            }
            return `:host([uid="${id}"]),[uid="${id}"] {${styles}}\n`;
          } else {
            return '';
          }
        })
        .join('') ?? ''
    );
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
    if (data?.style) {
      styles += data.style;
    }
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
      const breakpoint = ruleSet.breakpoint ?? this.screenService.getSmallest();
      if (required) classes.push(`${breakpoint}-${className}`);
    };

    add('bleed', ruleSet.bleed);
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
        // '--cols': data.columnCount,
        '--split-column-factor': data.splitColumnFactor,
        '--col-pos': data.gridColumn,
        '--row-pos': data.gridRow,
        // '--span': data.span,
        '--col-span': data.colSpan,
        '--row-span': data.rowSpan,
        '--rotate': data.rotate, // TODO
        'z-index': data.zIndex,
      },
      { omitUnit: true }
    );

    add({
      'align-items': data.align,
      '--top': data.top, // only used for sticky
      '--height': data.height, // only used for sticky
      width: data.width,
      margin: data.margin,
      border: data.border,
      'border-radius': data.radius,
      background: data.background,
      overflow: data?.overflow,
    });

    const gaps = data.gap?.toString().split(' ');
    add(
      { '--oryx-grid-gap-column': gaps?.[1] ?? gaps?.[0] },
      { omitUnit: true }
    );
    add({ '--oryx-grid-gap-row': gaps?.[0] }, { omitUnit: true });
    add({ '--rotate': data.rotate }, { unit: 'deg' }); // TODO + duplicate

    if (data.padding) {
      add({
        'padding-block': this.findCssValues(data.padding, 'top', 'bottom'),
        '--scroll-start': this.findCssValue(data.padding, 'start'),
      });

      if (!(data as any).layout) {
        add({
          'padding-inline': this.findCssValues(data.padding, 'start', 'end'),
        });
      }
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
