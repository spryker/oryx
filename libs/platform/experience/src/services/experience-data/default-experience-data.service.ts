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

  constructor(protected staticData = inject(ExperienceData, [])) {}

  getData(): ExperienceComponent[] {
    const staticData = this.staticData
      .flat()
      .sort((a) => (a.strategy ? 0 : -1));

    for (const data of staticData) {
      if (data.id) {
        this.recordsById[data.id] = data;

        continue;
      }

      if (data.strategy) {
        this.processMerging(data);

        continue;
      }

      this.records.push(data);
    }

    return [...this.records, ...Object.values(this.recordsById)];
  }

  protected processMerging(data: ExperienceComponent): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const strategy = data.strategy!;
    let { components } = this.recordsById[strategy?.id];

    for (const [key, value] of Object.entries(strategy)) {
      if (key === 'id') continue;

      const paths = value.split('.');

      for (let i = 0; i < paths.length; i++) {
        const [path, nested] = paths[i].split('>');

        if (nested) {
          paths.splice(i + 1, 0, ...Array(Number(nested) - 1).fill(path));
        }

        const [childPath, childIndex] = path.split(/[[\]]/);
        let childCounter = 1;
        let componentIndex = 0;
        console.log(childPath, childIndex);
        const component = components?.find(
          (component, index): void | boolean => {
            const isComponent = component.type === childPath;
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

        if (isLast && !childIndex) {
          this.mergeAll({
            data,
            components,
            type: key,
            name: path,
          });

          return;
        }

        if (isLast) {
          this.mergeByStrategy({
            data,
            components,
            type: key,
            componentIndex,
          });

          return;
        }

        components = component?.components;
      }
    }

    return;
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
        type === ExperienceDataMergeType.Before ||
        type === ExperienceDataMergeType.After
      ) {
        ++i;
      }
    }

    console.log(components);
  }

  protected mergeByStrategy(properties: MergeProperties): void {
    const { components, data, componentIndex = NaN, type } = properties;
    const merge = (start: number, end = 0) =>
      components?.splice(start, end, ...(data.components ?? []));

    if (type === ExperienceDataMergeType.Before) {
      merge(componentIndex);

      return;
    }

    if (type === ExperienceDataMergeType.After) {
      merge(componentIndex + 1);

      return;
    }

    if (type === ExperienceDataMergeType.Replace) {
      merge(componentIndex, 1);

      return;
    }

    if (type === ExperienceDataMergeType.Patch && components) {
      delete data.strategy;

      components[componentIndex] = {
        ...components[componentIndex],
        ...data,
      };

      return;
    }
  }
}
