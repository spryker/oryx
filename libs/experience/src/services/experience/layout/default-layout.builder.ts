import {
  CompositionLayout,
  CompositionProperties,
  StyleProperties,
} from '@spryker-oryx/experience';
import { LayoutBuilder } from './layout.builder';

export class DefaultLayoutBuilder implements LayoutBuilder {
  getLayoutClasses(data?: Partial<CompositionProperties>): string | undefined {
    const classes = this.getClasses(data).join(' ');
    return classes === '' ? undefined : classes;
  }

  getLayoutStyles(data?: StyleProperties): string | undefined {
    const styles = this.getStyleProperties(data).join('');
    return styles === '' ? undefined : styles;
  }

  /**
   * Populates an array of classes based on the layout properties provided
   * in the data.
   */
  protected getClasses(data?: Partial<CompositionProperties>): string[] {
    const classes: string[] = [];
    if (!data) {
      return classes;
    }

    const add = (className: string, required = false): void => {
      if (required) classes.push(className);
    };

    add('container', data.container);
    add('jumbotron', data.jumbotron);
    add('layout-carousel', data.layout === CompositionLayout.carousel);
    add('layout-column', data.layout === CompositionLayout.column);
    add(
      `column-count-${data.columnCount}`,
      data.layout === CompositionLayout.column && !!data.columnCount
    );
    add('sticky', data.position === 'sticky');

    return classes;
  }

  /**
   * Style properties are dynamically build and can be used for both
   * compositions and components.
   */
  protected getStyleProperties(data?: StyleProperties): string[] {
    const styles: string[] = [];
    if (!data) {
      return styles;
    }

    const add = (style: string, value?: string): void => {
      if (value) styles.push(`${style}:${value};`);
    };

    add('gap', data.gap);
    add('padding', data.padding);
    add('margin', data.margin);
    add('border', data.border);
    add('border-radius', data.radius);
    add('background', data.background);
    add('top', data.top);
    add('bottom', data.bottom);

    // TODO: consider dropping the CSS variable to avoid inheritance in descendant components
    add('--height', data.height);

    // col span is used in grid systems, so that a grid item can span multiple columns
    if (data.gridColSpan && data.gridColSpan > 0) {
      add('grid-column', `span ${data.gridColSpan}`);
    }

    if (data.width) {
      // both width and flex are explicitly set to accommodate grid and flex box systems
      // TODO: consider to subtract the gap-size
      add('width', data.width);
      add('flex', `0 0 ${data.width}`);
    }

    return styles;
  }
}
