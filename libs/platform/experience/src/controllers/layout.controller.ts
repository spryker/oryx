import { resolve } from '@spryker-oryx/di';
import { Breakpoint } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { LayoutAttributes } from '../../layout/src';
import { StyleRuleSet } from '../models';
import { LayoutBuilder, ResponsiveLayoutInfo } from '../services';

export class LayoutController {
  protected layoutBuilder = resolve(LayoutBuilder);

  getLayoutInfos(
    properties: string[],
    rules: StyleRuleSet[]
  ): ResponsiveLayoutInfo {
    const infos: ResponsiveLayoutInfo = {};

    properties.forEach((prop) => {
      const booleanPropertyType = prop !== 'layout';

      const mainLayout = this.collectMainLayout(rules, prop);
      const attr = (booleanPropertyType ? prop : mainLayout) as string;

      if (mainLayout) {
        infos[attr] = {
          excluded: this.findExcludedScreens(rules, prop, mainLayout as string),
        };
      }

      ['Xs', 'Sm', 'Md', 'Lg', 'Xl'].forEach((size) => {
        const compare = booleanPropertyType ? true : attr;
        const responsiveLayout =
          this.host[`${attr}${size}` as keyof LayoutAttributes] === compare ||
          rules?.find(
            (r) =>
              r.breakpoint === size.toLowerCase() &&
              r[attr as keyof LayoutAttributes] === compare
          );

        if (responsiveLayout === undefined) {
          const attr = rules?.find(
            (r) =>
              r.breakpoint === size.toLowerCase() &&
              r[prop as keyof LayoutAttributes]
          )?.[prop as keyof LayoutAttributes] as string;
          this.addToInfo(infos, attr, size);
        } else {
          this.addToInfo(infos, attr, size);
        }
      });
    });

    return infos;
  }

  /** returns a list of breakpoints that does not have the given value  */
  protected findExcludedScreens(
    rules: StyleRuleSet[],
    attr: string,
    value: string | boolean
  ): Breakpoint[] {
    return rules
      ?.filter(
        (rule) =>
          rule.breakpoint &&
          rule[attr as keyof LayoutAttributes] !== undefined &&
          rule[attr as keyof LayoutAttributes] !== value
      )
      .map((rule) => rule.breakpoint as Breakpoint);
  }

  protected addToInfo(
    infos: ResponsiveLayoutInfo,
    attr: string,
    size: string
  ): void {
    if (!attr) return;
    if (infos[attr]) {
      if (!infos[attr].included) {
        infos[attr].included = [];
      }
      infos[attr].included?.push(size.toLowerCase() as Breakpoint);
    } else {
      infos[attr] = {
        included: [size.toLowerCase() as Breakpoint],
      };
    }
  }

  /**
   * Resolves the main layout for the component by evaluating the component property
   * as well as the style rules provided by the options.
   */
  protected collectMainLayout(rules: StyleRuleSet[], prop: string): string {
    return (this.host[prop as keyof LayoutAttributes] ||
      rules?.find(
        (rule) => !rule.breakpoint && rule[prop as keyof StyleRuleSet]
      )?.[prop as keyof StyleRuleSet]) as string;
  }

  /**
   * Collects dynamic styles provided by component options.
   *
   * When the component does not have a layout, we add a rule to
   * ensure that the component children can transparently work with the
   * layout provided outside:
   *
   * ```css
   * :host {
   *   display: contents;
   * }
   * ```
   */
  collectStyles(rules: StyleRuleSet[], uid?: string): string {
    let styles = '';

    if (!this.hasLayout(rules)) {
      styles += ':host {display: contents;}\n';
    }

    if (uid) {
      styles += this.layoutBuilder.createStylesFromOptions(uid, rules);
    }

    return styles;
  }

  /**
   * Indicates whether the component has any layout associated to it.
   *
   * Layout can be either applied by using properties or by using options.
   */
  protected hasLayout(rules: StyleRuleSet[]): boolean {
    const has = (obj: LayoutAttributes): boolean =>
      !!obj['layout'] ||
      !!obj['layoutXs'] ||
      !!obj['layoutSm'] ||
      !!obj['layoutMd'] ||
      !!obj['layoutXl'];

    return has(this.host) || !!rules?.find((rule) => has(rule));
  }

  constructor(protected host: LitElement & LayoutAttributes) {}
}
