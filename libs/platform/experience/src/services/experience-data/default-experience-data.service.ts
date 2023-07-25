import { inject } from '@spryker-oryx/di';
import {
  ExperienceComponent,
  ExperienceData,
  ExperienceDataMergeType,
  ExperienceDataService,
} from './experience-data.service';

interface MergeProperties {
  data: ExperienceComponent;
  components?: ExperienceComponent[];
  componentIndex?: number;
  type: string;
  name?: string;
}

export class DefaultExperienceDataService implements ExperienceDataService {
  protected recordsById: Record<string, ExperienceComponent> = {};
  protected records: ExperienceComponent[] = [];

  constructor(protected experienceData = inject(ExperienceData, [])) {}

  getData(): ExperienceComponent[] {
    const experienceData: ExperienceComponent[] = JSON.parse(
      JSON.stringify(this.experienceData)
    )
      .flat()
      .sort((a: ExperienceComponent) => (a.merge ? 0 : -1));

    for (const data of experienceData) {
      if (data.merge) {
        this.processMerging(data);

        continue;
      }

      if (data.id) {
        this.recordsById[data.id] = data;
      }

      this.records.push(data);
    }

    return this.records;
  }

  protected processMerging(data: ExperienceComponent): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { type = ExperienceDataMergeType.Replace, selector } = data.merge!;
    const paths = selector.split('.');

    for (const record of this.records) {
      const isTemplateId = paths[0].startsWith('#');

      if (isTemplateId && record.id !== paths[0].substring(1)) {
        continue;
      }

      let { components } = record;

      for (let i = isTemplateId ? 1 : 0; i < paths.length; i++) {
        const [path, nested] = paths[i].split('>');

        if (nested) {
          paths.splice(i + 1, 0, ...Array(Number(nested) - 1).fill(path));
        }

        const [childPath, childIndex] = path.split(/[[\]]/);
        let childCounter = 1;
        let componentIndex = 0;

        const component = components?.find(
          (component, index): void | boolean => {
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
          }
        );

        const isLast = i === paths.length - 1;
        const isNotRepetitive = [
          ExperienceDataMergeType.Prepend,
          ExperienceDataMergeType.Append,
        ].includes(type as ExperienceDataMergeType);

        if (isLast && !childIndex && !isNotRepetitive) {
          this.mergeAll({
            data,
            components,
            type,
            name: path,
          });

          break;
        }

        if (isLast) {
          this.mergeByStrategy({
            data,
            components,
            type,
            componentIndex,
          });

          break;
        }

        components = component?.components;
      }
    }
  }

  protected mergeAll(properties: MergeProperties): void {
    const { components = [], data, name = '', type } = properties;

    for (let i = 0; i < components.length; i++) {
      if (name !== components[i].type) {
        continue;
      }

      this.mergeByStrategy({
        data,
        components,
        type,
        componentIndex: i,
      });

      if (
        [
          ExperienceDataMergeType.Before,
          ExperienceDataMergeType.Prepend,
          ExperienceDataMergeType.Append,
          ExperienceDataMergeType.After,
        ].includes(type as ExperienceDataMergeType) &&
        data.components?.length
      ) {
        i = i + data.components?.length;
      }
    }
  }

  protected mergeByStrategy(properties: MergeProperties): void {
    const { components = [], data, componentIndex = NaN, type } = properties;
    const merge = (start: number, end = 0) =>
      components?.splice(start, end, ...(data.components ?? []));
    delete data.merge;

    if (type === ExperienceDataMergeType.Before) {
      merge(componentIndex);

      return;
    }

    if (type === ExperienceDataMergeType.After) {
      merge(componentIndex + 1);

      return;
    }

    if (type === ExperienceDataMergeType.Replace) {
      data.type ??= 'oryx-composition';
      components[componentIndex] = data;

      return;
    }

    if (type === ExperienceDataMergeType.Append) {
      components?.push(data);

      return;
    }

    if (type === ExperienceDataMergeType.Prepend) {
      components?.unshift(data);

      return;
    }

    if (type === ExperienceDataMergeType.Patch) {
      components[componentIndex] = {
        ...components[componentIndex],
        ...data,
        ...(data.options && {
          options: {
            ...(components[componentIndex]?.options ?? {}),
            ...(data.options ?? {}),
          },
        }),
        ...(data.content && {
          content: {
            ...(components[componentIndex].content ?? {}),
            ...data.content,
            ...(data.content.data && {
              data: {
                ...(components[componentIndex].content?.data ?? {}),
                ...data.content.data,
              },
            }),
          },
        }),
      };
    }
  }
}
