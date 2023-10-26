import { resolve } from '@spryker-oryx/di';
import {
  LayoutAttributes,
  LayoutProperties,
} from '@spryker-oryx/experience/layout';
import { Size, sizes } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { Observable, map } from 'rxjs';
import {
  CompositionProperties,
  ContentComponentProperties,
  StyleRuleSet,
} from '../models';
import {
  LayoutBuilder,
  LayoutPluginParams,
  LayoutPluginRender,
  LayoutPluginType,
  LayoutService,
  LayoutStylesOptions,
  ResponsiveLayoutInfo,
} from '../services';

export interface LayoutRenderParams {
  place: keyof LayoutPluginRender;
  attrs: string[];
  data: Omit<LayoutPluginParams, 'options'> & {
    options?: CompositionProperties;
  };
  screen?: Size;
}

export class LayoutController {
  protected layoutBuilder = resolve(LayoutBuilder);
  protected layoutService = resolve(LayoutService);

  constructor(
    protected host: LitElement & LayoutAttributes & ContentComponentProperties
  ) {}

  getStyles(properties: string[], rules: StyleRuleSet[]): Observable<string> {
    const props = this.normalizeProperties(properties, rules);
    const infos = this.getLayoutInfos(props, rules);
    const componentStyles = this.collectStyles(props, rules, this.host.uid);

    return this.layoutService
      .getStyles(infos)
      .pipe(map((layoutStyles) => `${layoutStyles}${componentStyles}`));
  }

  getRender(config: LayoutRenderParams): TemplateResult {
    const { screen, attrs, place, data } = config;
    const host = this.host;

    const getLayoutRules = (): LayoutProperties => {
      const bpRules = data.options?.rules?.find(
        (rule) => rule.query?.breakpoint === screen && rule.layout
      )?.layout;
      const rules = data.options?.rules?.find(
        (rule) => !rule.query?.breakpoint && rule.layout
      )?.layout;
      const properties: LayoutStylesOptions & LayoutProperties = {
        ...(typeof rules === 'string' ? { type: rules } : rules),
        ...(typeof bpRules === 'string' ? { type: bpRules } : bpRules),
      };

      if (properties.type) {
        const layout = properties.type;
        delete properties.type;
        properties.layout = layout;
      }

      return properties;
    };

    const hostProperties = ['layout', ...attrs].reduce((acc, attr) => {
      const value = host[attr as keyof typeof host];

      if (attr === 'layout' && value) {
        return { ...acc, layout: value };
      }

      if (host.hasAttribute(attr)) {
        const prop = attr.replace('layout-', '');
        return { ...acc, [prop]: host.getAttribute(attr) || true };
      }

      return acc;
    }, {});

    const layoutOptions = {
      ...getLayoutRules(),
      ...hostProperties,
      ...(screen
        ? (host[
            `layout${screen.charAt(0).toUpperCase()}${screen.slice(
              1
            )}` as keyof typeof host
          ] as Record<string, unknown>)
        : {}),
    };

    return Object.entries(layoutOptions).reduce((acc, [prop, value]) => {
      if (!value) return acc;

      const token = prop === 'layout' ? (value as string) : prop;
      const type =
        prop === 'layout' ? LayoutPluginType.Layout : LayoutPluginType.Property;

      return html`${acc}
      ${this.layoutService.getRender({
        type,
        token,
        data: {
          ...data,
          options: layoutOptions,
        },
      })?.[place]}`;
    }, html``);
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
    layoutProperties: (keyof LayoutProperties)[],
    rules: StyleRuleSet[] = [],
    uid?: string
  ): string {
    let styles = '';

    if (layoutProperties.length === 1 && !this.hasLayout(rules)) {
      styles += ':host {display: contents;}\n';
    }

    styles += this.layoutBuilder.createStylesFromOptions(rules, uid);

    return styles;
  }

  protected normalizeProperties(
    properties: string[],
    rules: StyleRuleSet[]
  ): (keyof LayoutProperties)[] {
    const props = ['layout', ...properties.map(this.getPropertyName)];
    const ruleProps: StyleRuleSet[] = [...(rules ?? [])];

    for (const ruleProp of ruleProps) {
      if (typeof ruleProp.layout === 'string' && !props.includes('layout')) {
        props.push('layout');

        continue;
      }

      if (typeof ruleProp.layout === 'object') {
        for (const prop of Object.keys(ruleProp.layout)) {
          if (prop === 'type' && !props.includes('layout')) {
            props.push('layout');

            continue;
          }

          if (prop === 'type') continue;

          if (!props.includes(prop)) props.push(prop);
        }
      }
    }

    return props as (keyof LayoutProperties)[];
  }

  protected getPropertyName(attrName: string): keyof LayoutProperties {
    return attrName === 'layout'
      ? attrName
      : (attrName.replace('layout-', '') as keyof LayoutProperties);
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
