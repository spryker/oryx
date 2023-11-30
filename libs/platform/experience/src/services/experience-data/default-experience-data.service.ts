/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { inject } from '@spryker-oryx/di';
import {
  ExperienceComponent,
  ExperienceData,
  ExperienceDataMergeType,
  ExperienceDataService,
} from './experience-data.service';

interface MergeProperties {
  strategy: ExperienceComponent;
  template: ExperienceComponent;
  componentIndex?: number;
  name?: string;
  paths?: string[];
}

export class DefaultExperienceDataService implements ExperienceDataService {
  protected records: Record<string, ExperienceComponent> = {};
  protected strategies: ExperienceComponent[] = [];
  protected autoComponentId = 0;

  constructor(protected experienceData = inject(ExperienceData, [])) {}

  getData(cb: (c: ExperienceComponent) => void): ExperienceComponent[] {
    if (!Object.keys(this.records).length) this.initialize();

    const data = Object.values(this.records);
    this.registerComponent(data, cb);

    return data;
  }

  registerComponent(
    c: ExperienceComponent | ExperienceComponent[],
    cb?: ((c: ExperienceComponent) => void) | undefined
  ): void {
    const components = Array.isArray(c) ? [...c] : [c];

    for (const component of components) {
      component.id ??= this.getAutoId();
      cb?.(component);
      components.push(...(component.components ?? []));
    }
  }

  protected initialize(): void {
    const copy: ExperienceComponent[] = JSON.parse(
      JSON.stringify(this.experienceData)
    ).flat();

    // Divide strategies and templates
    for (const record of copy) {
      if (record.merge) {
        this.strategies.push(record);

        continue;
      }

      this.records ??= {};
      this.records[record.id!] = record;
    }

    const records = [...this.strategies, ...Object.values(this.records)];

    // Adds references to the components
    for (const record of records) {
      if (record.ref && this.records[record.ref]) {
        if (record.id) continue;

        Object.assign(
          record,
          JSON.parse(JSON.stringify(this.records[record.ref]))
        );
      }
      records.push(...(record.components ?? []));
    }

    this.processMerging();
  }

  protected processMerging(): void {
    const templates = Object.values(this.records);

    for (const strategy of this.strategies) {
      const { selector } = strategy.merge!;
      let templateId = '';
      const paths = selector
        .split('.')
        .map((path) => {
          if (path.startsWith('#')) {
            templateId = path.substring(1);

            return [];
          }

          const [name, nested] = path.split('>');
          return nested ? Array(Number(nested)).fill(name) : name;
        })
        .flat();
      const isTemplateOnly = !paths.length && templateId;

      for (const template of templates) {
        if (isTemplateOnly && template.id === templateId) {
          this.merge({
            strategy,
            template,
          });

          break;
        }

        if (templateId && template.id !== templateId) {
          continue;
        }

        this.recursiveSearch({ template, paths, strategy });
      }
    }
  }

  protected recursiveSearch(properties: MergeProperties): void {
    const { strategy, template, paths = [] } = properties;
    const { type } = strategy.merge!;
    const { components } = template;

    if (!components) {
      return;
    }

    const path = paths[0];
    const isMergeElement = paths.length === 1;

    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      const isMatch = component.type === path || component.id === path;

      if (isMatch && isMergeElement) {
        this.merge({
          strategy,
          template:
            type === ExperienceDataMergeType.Prepend ||
            type === ExperienceDataMergeType.Append
              ? component
              : template,
          componentIndex: i,
        });

        if (
          type === ExperienceDataMergeType.Before ||
          type === ExperienceDataMergeType.After
        )
          i++;

        if (type === ExperienceDataMergeType.Remove) i--;

        continue;
      }

      this.recursiveSearch({
        template: component,
        paths: isMergeElement || !isMatch ? paths : paths.slice(1),
        strategy,
      });
    }
  }

  protected merge(properties: MergeProperties): void {
    const { template, componentIndex = NaN } = properties;
    const strategy = { ...properties.strategy };
    const { type = ExperienceDataMergeType.Replace } = strategy.merge!;
    const { components = [] } = template;
    const isNaN = Number.isNaN(componentIndex);
    delete strategy.merge;

    if (type === ExperienceDataMergeType.Before && !isNaN) {
      components.splice(componentIndex, 0, strategy);

      return;
    }

    if (type === ExperienceDataMergeType.After && !isNaN) {
      components.splice(componentIndex + 1, 0, strategy);

      return;
    }

    if (type === ExperienceDataMergeType.Remove && !isNaN) {
      components.splice(componentIndex, 1);

      return;
    }

    if (type === ExperienceDataMergeType.Replace) {
      strategy.type ??= 'oryx-composition';

      if (!isNaN) {
        components[componentIndex] = strategy;
      } else {
        template.components = [strategy];
      }

      return;
    }

    if (type === ExperienceDataMergeType.Append) {
      components.push(strategy);

      return;
    }

    if (type === ExperienceDataMergeType.Prepend) {
      components.unshift(strategy);

      return;
    }

    if (type === ExperienceDataMergeType.Patch) {
      const component = components[componentIndex] ?? template;
      const newComponent = {
        ...component,
        ...strategy,
        ...(strategy.meta && {
          meta: {
            ...(component?.meta ?? {}),
            ...strategy.meta,
          },
        }),
        ...(strategy.options && {
          options: {
            ...(component?.options ?? {}),
            ...strategy.options,
          },
        }),
        ...(strategy.content && {
          content: {
            ...component.content,
            ...strategy.content,
            ...(strategy.content.data && {
              data: {
                ...component.content?.data,
                ...strategy.content.data,
              },
            }),
          },
        }),
      };

      Object.assign(component, newComponent);
    }
  }

  protected getAutoId(): string {
    return `hash${this.autoComponentId++}`;
  }
}
