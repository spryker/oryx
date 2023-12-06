import { Observable, of } from 'rxjs';
import {
  LayoutPlugin,
  LayoutPluginConfig,
  LayoutPluginPropertiesParams,
  LayoutStyleProperties,
  LayoutStylePropertiesArr,
} from '../../layout.plugin';

export class LayoutStylePlugin implements LayoutPlugin {
  getConfig(): Observable<LayoutPluginConfig> {
    return of({
      schema: () => import('./layout-style.schema').then((m) => m.schema),
    });
  }

  getStyleProperties(
    data: LayoutPluginPropertiesParams
  ): Observable<LayoutStyleProperties> {
    const { styles } = data;
    const gaps = styles.gap?.toString().split(' ');
    const isGridColumnAlias = styles.gridColumn && styles.colSpan;
    const isGridRowAlias = styles.gridRow && styles.rowSpan;
    const gridColumn: LayoutStylePropertiesArr = isGridColumnAlias
      ? [[{ 'grid-column': `${styles.gridColumn} / span ${styles.colSpan}` }]]
      : ([
          [
            ...(styles.gridColumn
              ? [{ 'grid-column': styles.gridColumn }, { omitUnit: true }]
              : []),
          ],
          [styles.colSpan ? { 'grid-column': `span ${styles.colSpan}` } : {}],
        ] as LayoutStylePropertiesArr);
    const gridRow: LayoutStylePropertiesArr = isGridRowAlias
      ? [[{ 'grid-row': `${styles.gridRow} / span ${styles.rowSpan}` }]]
      : ([
          [
            ...(styles.gridRow
              ? [{ 'grid-row': styles.gridRow }, { omitUnit: true }]
              : []),
          ],
          [styles.rowSpan ? { 'grid-row': `span ${styles.rowSpan}` } : {}],
        ] as LayoutStylePropertiesArr);

    return of([
      [{ '--align': styles.align, '--justify': styles.justify }],
      [
        { '--column-gap': gaps?.[1] ?? gaps?.[0], '--row-gap': gaps?.[0] },
        { emptyValue: true },
      ],
      [{ '--oryx-column-count': styles.columnCount }, { omitUnit: true }],
      ...gridColumn,
      ...gridRow,
    ]);
  }
}
