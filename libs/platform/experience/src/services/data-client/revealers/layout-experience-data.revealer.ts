import { inject, INJECTOR } from '@spryker-oryx/di';
import { FormFieldType } from '@spryker-oryx/form';
import { resolveLazyLoadable } from '@spryker-oryx/utilities';
import { combineLatest, Observable, switchMap, tap } from 'rxjs';
import { FieldDefinition } from '../../../models';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPropertyPlugin,
  LayoutStylesPlugin,
} from '../../layout';
import { ExperienceDataRevealer } from '../data-client.service';
import { postMessage } from '../utilities';

export class LayoutExperienceDataRevealer implements ExperienceDataRevealer {
  constructor(
    protected layouts = inject(LayoutPlugin),
    protected properties = inject(LayoutPropertyPlugin),
    protected styles = inject(LayoutStylesPlugin),
    protected injector = inject(INJECTOR)
  ) {}

  protected types$ = combineLatest(
    this.layouts.map((layout) => layout.getConfig())
  ).pipe(switchMap(this.resolveSchemas));

  protected styles$ = combineLatest(
    this.styles.map((style) => style.getConfig())
  ).pipe(switchMap(this.resolveSchemas));

  protected properties$ = combineLatest(
    this.properties.map((property) => property.getConfig())
  ).pipe(switchMap(this.resolveSchemas));

  protected layouts$ = combineLatest([
    this.types$,
    this.properties$,
    this.styles$,
  ]).pipe(
    tap(([types, properties, styles]) => {
      console.log(types, 'type');
      console.log('_______');
      console.log(properties, 'properties');
      console.log('_______');
      console.log(styles, 'styles');
      console.log('_______');
      const typeField: FieldDefinition = {
        id: 'layout-type',
        label: 'layout',
        type: FormFieldType.Select,
        options: Object.keys(types).map((value) => ({ value })),
      };
      const propertiesSchema = Object.keys(properties).map((property) => ({
        id: `layout-${property}`,
        label: property,
        type: FormFieldType.Boolean,
      }));
      const stylesSchema = Object.entries(styles).reduce(
        (acc, [key, value]) => {
          const values = Object.entries(value).map(([key, _value]) => ({
            id: key,
            ...(_value as any),
          }));
          acc[key] = values;
          return acc;
        },
        {} as any
      );

      const data = {
        container: [typeField, ...propertiesSchema],
        ...stylesSchema,
      };

      postMessage({ type: 'layout', data });
    })
  );

  protected async resolveSchemas(
    configs: LayoutPluginConfig[]
  ): Promise<Record<string, any>> {
    const data: Record<string, any> = {};
    for (const config of configs) {
      const schema = await resolveLazyLoadable(config.schema);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      data[schema!.name] = schema?.options;
    }

    return data;
  }

  reveal(): Observable<unknown> {
    return this.layouts$;
  }
}
