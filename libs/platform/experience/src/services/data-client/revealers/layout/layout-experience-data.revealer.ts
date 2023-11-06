import { inject } from '@spryker-oryx/di';
import { FormFieldType } from '@spryker-oryx/form';
import { resolveLazyLoadable } from '@spryker-oryx/utilities';
import {
  combineLatest,
  forkJoin,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { ContentComponentSchema, FieldDefinition } from '../../../../models';
import {
  LayoutPlugin,
  LayoutPropertyPlugin,
  LayoutStylesOptions,
  LayoutStylesPlugin,
} from '../../../layout';
import { MessageType } from '../../data-client.model';
import { ExperienceDataRevealer } from '../../data-client.service';
import { catchMessage, postMessage } from '../../utilities';

interface ResolvedPlugin {
  options: ContentComponentSchema['options'];
  defaults?: LayoutStylesOptions;
}

export class LayoutExperienceDataRevealer implements ExperienceDataRevealer {
  constructor(
    protected layouts = inject(LayoutPlugin),
    protected properties = inject(LayoutPropertyPlugin),
    protected styles = inject(LayoutStylesPlugin)
  ) {}

  protected types$ = this.resolvePlugin(this.layouts);
  protected properties$ = this.resolvePlugin(this.properties);
  protected styles$ = this.resolvePlugin(this.styles);

  protected layouts$ = catchMessage(MessageType.SelectedStyles).pipe(
    startWith({}),
    switchMap((selectedLayout) => {
      const layout: LayoutStylesOptions =
        typeof selectedLayout === 'string'
          ? {
              type: selectedLayout,
            }
          : selectedLayout ?? {};

      return combineLatest([this.types$, this.properties$, this.styles$]).pipe(
        map(([types, properties, styles]) => {
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
          const data: Record<string, FieldDefinition[]> = {
            container: [typeField, ...propertiesSchema],
          };
          let defaults = {};

          for (const [key, selected] of Object.entries(layout ?? {})) {
            const isLayout = key === 'type';
            const hasOptions = isLayout
              ? types[selected as string].options
              : properties[key]?.options;

            if (!selected || !hasOptions) continue;

            const schema = isLayout ? types : properties;
            const id = isLayout ? selected : key;

            data.special ??= [];
            data.special.push(
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...this.transformLayoutOptions(schema[id].options!)
            );
            defaults = { ...defaults, ...schema[id].defaults };
          }

          const stylesSchema = Object.entries(styles).reduce(
            (acc, [key, value]) => ({
              ...acc,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              [key]: this.transformLayoutOptions(value.options!, true),
            }),
            {} as Record<string, FieldDefinition[]>
          );

          return {
            fields: { ...data, ...stylesSchema },
            defaults,
          };
        })
      );
    }),
    tap((data) => postMessage({ type: MessageType.StylesOptions, data }))
  );

  protected transformLayoutOptions(
    props: Record<string, Omit<FieldDefinition, 'id'>>,
    isStyles = false
  ): FieldDefinition[] {
    return Object.entries(props).map(([key, _value]) => ({
      id: isStyles ? key : `layout-${key}`,
      ..._value,
      label: key.replace(/([A-Z])/g, (g) => ` ${g}`),
    }));
  }

  protected resolvePlugin(
    plugins: LayoutPlugin[]
  ): Observable<Record<string, ResolvedPlugin>> {
    return combineLatest(
      plugins.map((plugin) =>
        forkJoin({
          config: plugin.getConfig(),
          defaults:
            plugin.getDefaultProperties?.()?.pipe(startWith({})) ??
            of(undefined),
        })
      )
    ).pipe(
      switchMap(async (resolved) => {
        const data: Record<string, ResolvedPlugin> = {};

        for (const plugin of resolved) {
          const { config, defaults } = plugin;
          const schema = await resolveLazyLoadable(config.schema);

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          data[schema!.name] = {
            options: schema?.options,
            defaults,
          };
        }

        return data;
      })
    );
  }

  reveal(): Observable<unknown> {
    return this.layouts$;
  }
}
