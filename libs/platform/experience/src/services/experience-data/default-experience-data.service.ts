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
}

export class DefaultExperienceDataService implements ExperienceDataService {
  protected records?: Record<string, ExperienceComponent>;
  protected strategies: ExperienceComponent[] = [];
  protected autoComponentId = 0;

  constructor(protected experienceData = inject(ExperienceData, [])) {}

  getData(cb: (c: ExperienceComponent) => void): ExperienceComponent[] {
    if (!this.records) this.initialize();

    const data = Object.values(this.records!);

    // Register all components with has id's
    for (const record of data) {
      if (!record.id?.includes('hash')) {
        record.id = record.id
          ? `${record.id}-${this.getAutoId()}`
          : this.getAutoId();
      }

      cb?.(record);
      data.push(...(record.components ?? []));
    }
    console.log(this.records);
    return Object.values(this.records!);
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

    const records = [...this.strategies, ...Object.values(this.records!)];

    // Adds references to the components
    for (const record of records) {
      if (record.ref && this.records![record.ref]) {
        Object.assign(
          record,
          JSON.parse(JSON.stringify(this.records![record.ref]))
        );
        delete record.ref;
      }

      records.push(...(record.components ?? []));
    }

    this.processMerging();
  }

  protected processMerging(): void {
    const templates = Object.values(this.records!);

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
          this.mergeByStrategy({
            strategy,
            template,
          });

          break;
        }

        if (templateId && template.id !== templateId) {
          continue;
        }

        this.recursiveMerge(template, paths, strategy);
      }
    }
  }

  protected recursiveMerge(
    template: ExperienceComponent,
    paths: string[],
    strategy: ExperienceComponent
  ): void {
    const components = template.components ?? [];

    for (let i = 0; i < components.length; i++) {
      const component = components[i];

      if (component.type === paths[0] || component.id === paths[0]) {
        if (paths.length === 1) {
          this.mergeByStrategy({
            strategy,
            template,
            componentIndex: i,
          });

          if (
            strategy.merge?.type === ExperienceDataMergeType.Before ||
            strategy.merge?.type === ExperienceDataMergeType.After
          )
            i += 1;

          continue;
        }

        this.recursiveMerge(component ?? [], paths.slice(1), strategy);

        continue;
      }

      this.recursiveMerge(component ?? [], paths, strategy);
    }
  }

  protected getChildData(
    path: string,
    components?: ExperienceComponent[]
  ): {
    component?: ExperienceComponent;
    componentIndex: number;
    childIndex: string;
  } {
    const [childPath, childIndex] = path.split(/[[\]]/);
    let childCounter = 1;
    let componentIndex = 0;

    const component = components?.find((component, index): void | boolean => {
      const isComponent =
        component.type === childPath || component.id === childPath;
      const isProperChild = childCounter === Number(childIndex);
      const withIndex = !childIndex && isComponent;
      const withoutIndex = childIndex && isComponent && isProperChild;

      if (withIndex || withoutIndex) {
        componentIndex = index;

        return true;
      }

      if (isComponent && !isProperChild) {
        ++childCounter;
      }
    });

    return {
      component,
      componentIndex,
      childIndex,
    };
  }

  protected mergeByStrategy(properties: MergeProperties): void {
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

    if (type === ExperienceDataMergeType.Replace) {
      strategy.type ??= 'oryx-composition';

      if (componentIndex) {
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
