import { resolve } from '@spryker-oryx/di';
import {
  LayoutAttributes,
  LayoutProperties,
} from '@spryker-oryx/experience/layout';
import { sizes } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { StyleRuleSet } from '../models';
import { LayoutBuilder, ResponsiveLayoutInfo } from '../services';
export class LayoutController {
  constructor(protected host: LitElement & LayoutAttributes) {}

  protected layoutBuilder = resolve(LayoutBuilder);

  getLayoutInfos(
    properties: (keyof LayoutProperties)[],
    rules: StyleRuleSet[] = []
  ): ResponsiveLayoutInfo {
    return properties.reduce((info, prop) => {
      const isLayout = prop === 'layout';
      const mainValue =
        this.host[prop] ??
        rules.find((rule) => !rule.breakpoint && rule[prop])?.[prop];
      const mainKey = (isLayout ? mainValue : prop) as string;

      if (mainValue) {
        info[mainKey] = {};
      }

      for (const size of sizes) {
        const sizeValue =
          this.host[size]?.[prop] ??
          rules.find((rule) => rule.breakpoint === size && rule[prop])?.[prop];
        const sizeKey = (isLayout ? sizeValue : prop) as string;

        if (!sizeValue || !sizeKey) {
          continue;
        }

        info[sizeKey] ??= {};
        const dataSize = info[sizeKey];

        if (mainValue && sizeKey === String(mainValue)) {
          dataSize.excluded ??= [];
          dataSize.excluded.push(size);
          continue;
        }

        dataSize.included ??= [];
        dataSize.included.push(size);
      }

      return info;
    }, {} as ResponsiveLayoutInfo);
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
  collectStyles(
    rules: StyleRuleSet[],
    uid?: string,
    excludeProps?: (keyof LayoutProperties)[]
  ): string {
    let styles = '';

    if (!this.hasLayout(rules, excludeProps)) {
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
  protected hasLayout(
    rules: StyleRuleSet[],
    excludeProps: (keyof LayoutProperties)[] = []
  ): boolean {
    const has = (obj: LayoutAttributes): boolean =>
      excludeProps.some(
        (prop) => obj[prop] || sizes.some((size) => obj[size]?.[prop])
      );

    return has(this.host) || rules?.some((rule) => has(rule));
  }
}
