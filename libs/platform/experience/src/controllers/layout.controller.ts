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
  LayoutPluginType,
  LayoutService,
  ResponsiveLayoutInfo,
} from '../services';
export class LayoutController {
  protected layoutBuilder = resolve(LayoutBuilder);
  protected layoutService = resolve(LayoutService);

  constructor(
    protected host: LitElement & LayoutAttributes & ContentComponentProperties
  ) {}

  protected layoutBuilder = resolve(LayoutBuilder);
  protected layoutService = resolve(LayoutService);

  getStyles(
    properties: (keyof LayoutProperties)[],
    rules: StyleRuleSet[] = []
  ): Observable<string> {
    const infos = this.getLayoutInfos(properties, rules);

    const componentStyles = this.collectStyles(
      properties,
      rules,
      this.host.uid
    );

    return this.layoutService
      .getStyles(infos)
      .pipe(map((layoutStyles) => `${layoutStyles}${componentStyles}`));
  }

  protected getLayoutInfos(
    properties: (keyof LayoutProperties)[],
    rules: StyleRuleSet[] = []
  ): ResponsiveLayoutInfo {
    const isRule = (rule: StyleRuleSet, isLayout: boolean, ruleProp: string) =>
      (typeof rule.layout === 'string' && isLayout) ||
      (typeof rule.layout === 'object' &&
        rule.layout[ruleProp as keyof typeof rule.layout] !== undefined);
    const getRuleValue = (rule?: StyleRuleSet, prop?: string) =>
      typeof rule?.layout === 'string'
        ? rule.layout
        : rule?.layout?.[prop as keyof typeof rule.layout];
    const getType = (isLayout: boolean) =>
      isLayout ? LayoutPluginType.Layout : LayoutPluginType.Property;

    return properties.reduce((info, prop) => {
      const host = this.host;
      const isLayout = prop === 'layout';
      const hostProp = (
        isLayout ? prop : `layout-${prop}`
      ) as keyof typeof host;
      const ruleProp = isLayout ? 'type' : prop;
      const ruleValue = rules.find(
        (rule) => !rule.query?.breakpoint && isRule(rule, isLayout, ruleProp)
      );
      const mainValue = host[hostProp] ?? getRuleValue(ruleValue, ruleProp);

      const mainKey = (isLayout ? mainValue : prop) as string;
      const withMainValue = typeof mainValue !== 'undefined';

      if (withMainValue) {
        info[mainKey] = { type: getType(isLayout) };
      }

      for (const size of sizes) {
        const ruleSizeValue = rules.find(
          (rule) =>
            rule.query?.breakpoint === size && isRule(rule, isLayout, ruleProp)
        );
        const sizeValue =
          host[size]?.[prop] ?? getRuleValue(ruleSizeValue, ruleProp);
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

        if (withMainValue && sizeKey === mainKey) continue;

        info[sizeKey] ??= { type: getType(isLayout) };
        const dataSize = info[sizeKey];

        dataSize.included ??= [];
        dataSize.included.push(size);
      }

      return info;
    }, {} as ResponsiveLayoutInfo);
  }

  protected hasLayout(rules: StyleRuleSet[]): boolean {
    return !!this.host.layout || rules?.some((rule) => rule.layout);
  }
}
