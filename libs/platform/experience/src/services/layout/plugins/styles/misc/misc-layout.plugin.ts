import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class MiscLayoutPlugin implements LayoutPlugin {
  getConfig(): LayoutPluginConfig {
    return {
      schema: () => import('./misc-layout.schema').then((m) => m.schema),
    };
  }

  getStyleProperties(data: LayoutStyleParameters): LayoutStyleProperties {
    const gaps = data.gap?.toString().split(' ');
    const isGridColumnAlias = data.gridColumn && data.colSpan;
    const isGridRowAlias = data.gridRow && data.rowSpan;
    const gridColumn: LayoutStyleProperties = isGridColumnAlias
      ? [[{ 'grid-column': `${data.gridColumn} / span ${data.colSpan}` }]]
      : [
          [{ 'grid-column': data.gridColumn }, { omitUnit: true }],
          [data.colSpan ? { 'grid-column': `span ${data.colSpan}` } : {}],
        ];
    const gridRow: LayoutStyleProperties = isGridRowAlias
      ? [[{ 'grid-row': `${data.gridRow} / span ${data.rowSpan}` }]]
      : [
          [{ 'grid-row': data.gridRow }, { omitUnit: true }],
          [data.rowSpan ? { 'grid-row': `span ${data.rowSpan}` } : {}],
        ];

    return [
      [
        {
          '--align': data.align,
          '--justify': data.justify,
          border: data.border,
          'border-radius': data.radius,
          background: data.background,
          '--oryx-fill': data.fill,
          'aspect-ratio': data.ratio,
          overflow: data.overflow,
        },
      ],
      [
        { '--column-gap': gaps?.[1] ?? gaps?.[0], '--row-gap': gaps?.[0] },
        { emptyValue: true },
      ],
      [
        { 'z-index': data.zIndex, '--oryx-column-count': data.columnCount },
        { omitUnit: true },
      ],
      ...gridColumn,
      ...gridRow,
    ];
  }
}
