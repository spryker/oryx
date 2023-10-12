import { resolve } from '@spryker-oryx/di';
import {
  LayoutAttributes,
  LayoutProperties,
} from '@spryker-oryx/experience/layout';
import { sizes } from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { Observable, map } from 'rxjs';
import { ContentComponentProperties, StyleRuleSet } from '../models';
import {
  LayoutBuilder,
  LayoutService,
  ResponsiveLayoutInfo,
} from '../services';

interface LayoutProperty {
  hostProp: keyof LayoutProperties;
  ruleProp: keyof LayoutProperties;
  prop: string;
}

export class LayoutController {
  constructor(
    protected host: LitElement & LayoutAttributes & ContentComponentProperties
  ) {}

  protected layoutBuilder = resolve(LayoutBuilder);
  protected layoutService = resolve(LayoutService);

  getStyles(
    properties: (keyof LayoutProperties)[],
    rules: StyleRuleSet[]
  ): Observable<string> {
    const props = this.normalizeProperties(properties, rules);
    const infos = this.getLayoutInfos(props, rules);
    const componentStyles = this.collectStyles(props, rules, this.host.uid);

    return this.layoutService
      .getStyles(infos)
      .pipe(map((layoutStyles) => `${layoutStyles}${componentStyles}`));
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
   * @deprecated will be protected since 1.2
   */
  collectStyles(
    layoutProperties: LayoutProperty[],
    rules: StyleRuleSet[] = [],
    uid?: string
  ): string {
    let styles = '';

    if (!layoutProperties.length) {
      styles += ':host {display: contents;}\n';
    }

    styles += this.layoutBuilder.createStylesFromOptions(rules, uid);

    return styles;
  }

  protected normalizeProperties(
    properties: (keyof LayoutProperties)[],
    rules: StyleRuleSet[]
  ): LayoutProperty[] {
    const props = [...properties].map((hostProp) => {
      const prop = hostProp.replace('layout-', '');

      return {
        prop: !prop.length ? hostProp : prop,
        hostProp,
        ruleProp:
          hostProp === 'layout'
            ? hostProp
            : (`layout${prop.charAt(0).toUpperCase()}${prop.slice(
                1
              )}` as keyof LayoutProperties),
      };
    });

    const ruleProps: (StyleRuleSet | string)[] = [...(rules ?? [])];

    for (const ruleProp of ruleProps) {
      if (typeof ruleProp === 'object') {
        ruleProps.push(...Object.keys(ruleProp));
        continue;
      }

      if (
        ruleProp.startsWith('layout') &&
        !props.some((props) => props.ruleProp === ruleProp)
      ) {
        const prop = ruleProp.replace('layout', '');

        props.push({
          prop: !prop.length ? ruleProp : prop.toLowerCase(),
          ruleProp: ruleProp as keyof LayoutProperties,
          hostProp:
            ruleProp === 'layout'
              ? ruleProp
              : (`layout-${prop.charAt(0).toLowerCase()}${prop.slice(
                  1
                )}` as keyof LayoutProperties),
        });
      }
    }

    return props;
  }

  protected getLayoutInfos(
    properties: LayoutProperty[],
    rules: StyleRuleSet[] = []
  ): ResponsiveLayoutInfo {
    return properties.reduce((info, props) => {
      const { ruleProp, hostProp, prop } = props;
      const isLayout = prop === 'layout';
      const mainValue = (this.host[hostProp] ??
        rules.find((rule) => !rule.query?.breakpoint && rule[ruleProp])?.[
          ruleProp
        ]) as string;

      const mainKey = isLayout ? mainValue : prop;
      const withMainValue = typeof mainValue !== 'undefined';

      if (withMainValue) {
        info[mainKey] = {};
      }

      for (const size of sizes) {
        const sizeValue =
          this.host[size]?.[hostProp] ??
          rules.find(
            (rule) =>
              rule.query?.breakpoint === size &&
              typeof rule[ruleProp] !== 'undefined'
          )?.[ruleProp];
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
}
