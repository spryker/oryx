import { inject } from '@spryker-oryx/di';
import {
  ExperienceComponent,
  ExperienceData,
  ExperienceDataMergeType,
  ExperienceDataService,
} from './experience-data.service';

interface MergeProperties {
  strategy: ExperienceComponent;
  components?: ExperienceComponent[];
  componentIndex?: number;
  name?: string;
}

export class DefaultExperienceDataService implements ExperienceDataService {
  protected records: Record<string, ExperienceComponent> = {};
  protected strategies: ExperienceComponent[] = [];
  protected autoComponentId = 0;

  constructor(protected experienceData = inject(ExperienceData, [])) {}

  getData(cb: (c: ExperienceComponent) => void): ExperienceComponent[] {
    const copy: ExperienceComponent[] = JSON.parse(
      JSON.stringify(this.experienceData)
    ).flat();

    // Sort strategies and templates
    for (const record of copy) {
      if (record.merge) {
        this.strategies.push(record);

        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.records[record.id!] = record;
    }

    const records = [...this.strategies, ...Object.values(this.records)];

    // Adds references to the components
    for (const record of records) {
      if (record.ref && this.records[record.ref]) {
        Object.assign(
          record,
          JSON.parse(JSON.stringify(this.records[record.ref]))
        );
        delete record.ref;
      }

      record.id ??= this.getAutoId();
      cb?.(record);
      records.push(...(record.components ?? []));
    }

    this.processMerging();

    return Object.values(this.records);
  }

  protected processMerging(): void {
    const templates = Object.values(this.records);

    for (const strategy of this.strategies) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { selector, disableGlobal } = strategy.merge!;
      const paths = selector.split('.');
      const isTemplateId = paths[0].startsWith('#');
      const templateId = paths[0].substring(1);
      const isTemplateOnly = paths.length === 1 && isTemplateId;

      if (disableGlobal) {
        for (const template of templates) {
          const innerPaths = [...paths];

          if (isTemplateOnly && template.id === templateId) {
            this.mergeByStrategy({
              strategy,
              components: template.components,
            });

            break;
          }

          if (isTemplateId && template.id !== templateId) {
            continue;
          }

          let { components } = template;

          for (let i = isTemplateId ? 1 : 0; i < innerPaths.length; i++) {
            const [path, nested] = innerPaths[i].split('>');

            if (nested) {
              innerPaths.splice(
                i + 1,
                0,
                ...Array(Number(nested) - 1).fill(path)
              );
            }

            const { component, childIndex, componentIndex } = this.getChildData(
              path,
              components
            );

            const isLast = i === innerPaths.length - 1;

            if (isLast && !childIndex) {
              this.mergeAll({
                strategy,
                components,
                name: path,
              });

              break;
            }

            if (isLast) {
              this.mergeByStrategy({
                strategy,
                components,
                componentIndex,
              });
            }

            components = component?.components;
          }
        }

        continue;
      }

      const mainTemplates = templates.length;

      for (const [index, template] of templates.entries()) {
        if (
          isTemplateId &&
          template.id !== templateId &&
          index < mainTemplates
        ) {
          continue;
        }

        const path = isTemplateId && paths.length === 2 ? paths[1] : paths[0];

        this.mergeAll({
          strategy,
          components: template.components,
          name: path,
        });

        templates.push(...(template?.components ?? []));
      }
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

  protected mergeAll(properties: MergeProperties): void {
    const { components = [], strategy, name = '' } = properties;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { type } = strategy.merge!;

    for (let i = 0; i < components.length; i++) {
      if (name !== components[i].type && name !== components[i].id) {
        continue;
      }

      this.mergeByStrategy({
        strategy,
        components:
          type === ExperienceDataMergeType.Prepend ||
          type === ExperienceDataMergeType.Append
            ? components[i].components
            : components,
        componentIndex: i,
      });

      if (
        type === ExperienceDataMergeType.Before ||
        type === ExperienceDataMergeType.After
      )
        i++;
    }
  }

  protected mergeByStrategy(properties: MergeProperties): void {
    const { components = [], componentIndex = NaN } = properties;
    const strategy = { ...properties.strategy };
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { type = ExperienceDataMergeType.Replace } = strategy.merge!;
    const merge = (start: number, end = 0) =>
      components.splice(start, end, strategy);
    delete strategy.merge;

    if (type === ExperienceDataMergeType.Before) {
      merge(componentIndex);

      return;
    }

    if (type === ExperienceDataMergeType.After) {
      merge(componentIndex + 1);

      return;
    }

    if (type === ExperienceDataMergeType.Replace) {
      strategy.type ??= 'oryx-composition';
      components[componentIndex] = strategy;

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
      components[componentIndex] = {
        ...components[componentIndex],
        ...strategy,
        ...(strategy.options && {
          options: {
            ...(components[componentIndex]?.options ?? {}),
            ...(strategy.options ?? {}),
          },
        }),
        ...(strategy.content && {
          content: {
            ...(components[componentIndex].content ?? {}),
            ...strategy.content,
            ...(strategy.content.data && {
              data: {
                ...(components[componentIndex].content?.data ?? {}),
                ...strategy.content.data,
              },
            }),
          },
        }),
      };
    }
  }

  protected getAutoId(): string {
    return `static${this.autoComponentId++}`;
  }
}
