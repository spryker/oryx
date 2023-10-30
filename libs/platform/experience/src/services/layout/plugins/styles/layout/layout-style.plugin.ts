import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutStyleParameters,
  LayoutStyleProperties,
} from '../../layout.plugin';

export class LayoutStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./layout-style.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutStyleParameters
  ): Observable<LayoutStyleProperties> {
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

    return of([
      [{ '--align': data.align, '--justify': data.justify }],
      [
        { '--column-gap': gaps?.[1] ?? gaps?.[0], '--row-gap': gaps?.[0] },
        { emptyValue: true },
      ],
      [{ '--oryx-column-count': data.columnCount }, { omitUnit: true }],
      ...gridColumn,
      ...gridRow,
    ]);
  }
}
