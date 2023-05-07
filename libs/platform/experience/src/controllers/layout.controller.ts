import { resolve } from '@spryker-oryx/di';
import {
  LayoutAttributes,
  LayoutProperties,
} from '@spryker-oryx/experience/layout';
import { sizes } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { Observable } from 'rxjs';
import { StyleRuleSet } from '../models';
import {
  LayoutBuilder,
  LayoutService,
  ResponsiveLayoutInfo,
} from '../services';
export class LayoutController {
  constructor(protected host: LitElement & LayoutAttributes) {}

  protected layoutBuilder = resolve(LayoutBuilder);
  protected layoutService = resolve(LayoutService);

  getStyles(
    properties: (keyof LayoutProperties)[],
    rules: StyleRuleSet[] = []
  ): Observable<string> {
    const infos = this.getLayoutInfos(properties, rules);

    return this.layoutService.getStyles(infos);
  }

  protected getLayoutInfos(
    properties: (keyof LayoutProperties)[],
    rules: StyleRuleSet[] = []
  ): ResponsiveLayoutInfo {
    return properties.reduce((info, prop) => {
      const isLayout = prop === 'layout';
      const mainValue =
        this.host[prop] ??
        rules.find((rule) => !rule.breakpoint && rule[prop])?.[prop];
      const mainKey = (isLayout ? mainValue : prop) as string;
      const withMainValue = typeof mainValue !== 'undefined';

      if (withMainValue) {
        info[mainKey] = {};
      }

      for (const size of sizes) {
        const sizeValue =
          this.host[size]?.[prop] ??
          rules.find(
            (rule) =>
              rule.breakpoint === size && typeof rule[prop] !== 'undefined'
          )?.[prop];
        const sizeKey = (isLayout ? sizeValue : prop) as string;

        if (
          typeof sizeValue === 'undefined' ||
          !sizeKey ||
          String(sizeValue) === String(mainValue)
        ) {
          continue;
        }

        if (withMainValue && String(sizeValue) !== String(mainValue)) {
          info[mainKey].excluded ??= [];
          info[mainKey].excluded?.push(size);
        }

        if (withMainValue && sizeKey === mainKey) {
          continue;
        }

        info[sizeKey] ??= {};
        const dataSize = info[sizeKey];

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
    byProps: (keyof LayoutProperties)[],
    rules: StyleRuleSet[] = [],
    uid?: string
  ): string {
    let styles = '';

    if (!this.hasLayout(rules, byProps)) {
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
    byProps: (keyof LayoutProperties)[] = []
  ): boolean {
    const has = (obj: LayoutAttributes): boolean =>
      byProps.some(
        (prop) => obj[prop] || sizes.some((size) => obj[size]?.[prop])
      );

    return has(this.host) || rules?.some((rule) => has(rule));
  }
}
