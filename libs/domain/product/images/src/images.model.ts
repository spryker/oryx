export interface ProductImagesComponentOptions {
  mediaSet?: string;

  scrollBehavior?: ProductImagesScrollBehavior;

  /**
   * The main image shows a single image at the time. The images
   * can be shown in a scrollable carousel or toggled one at the time.
   *
   * The carousel layout provides a scrollable area for the user as well
   * as shows the scroll effect when the user navigates with the thumbnail
   * navigation.
   *
   * The toggle layout will not allow to navigate in the main section, but
   * only through the thumbnail navigation. There will also not be a scroll
   * effect when the user navigates.
   *
   * @default 'carousel'
   */
  imageLayout?: ProductImagesMainLayout;

  /**
   * Allows to position the navigation at each side of the main image:
   * at the top of bottom, or aside at the start or end.
   *
   * @default 'bottom'
   */
  navigationPosition?: ProductImagesNavigationPosition;

  /**
   * Allows the display mode of the navigation. The display supports inline,
   * floating or none. Floating thumbnails will overlap with the main
   * image.
   *
   * @default 'inline'
   */
  navigationDisplay?: ProductImagesNavigationDisplay;

  /**
   * Defines the layout for the navigation, either carousel or grid.
   * When the grid navigation is used, the thumbnail navigation might
   * require multiple columns or rows in case of a lot of images.
   *
   * @default 'carousel'
   */
  navigationLayout?: ProductImagesNavigationLayout;

  /**
   * Allows to position navigation on the active axis
   *
   * @default 'center'
   */
  navigationAlignment?: ProductImagesNavigationAlignment;

  /**
   * The image navigation is used to toggle the main image when a
   * navigation image is selected. This selection is triggered by default
   * on mouse click, but using `ProductImagesNavigationMouseEvent.Mouseover`
   * the main image is toggled on hover.
   *
   * @default ProductImagesNavigationMouseEvent.Click
   */
  navigationMouseEvent?: ProductImagesNavigationMouseEvent;

  /**
   * The height of the main image can be provided in pixels.
   * The height of the image is important to ensure that the layout
   * has a minimum height.
   *
   * @default `300px`
   */
  imageHeight?: string;

  /**
   * The width of the main image can be provided in pixels.
   *
   * The width is used in the layout as well as reflected on the
   * actual img element to avoid layout shifts.
   *
   * There is no default applied, so that images will take the full available width.
   */
  imageWidth?: string;

  /**
   * The height of the navigation thumbnail can be provided in pixels.
   * The default value for the thumbnails use a CSS function to use the minimum
   * of 80px or 8vw (8% of the viewport width).
   *
   * @default min(8vw, 80px)
   */
  navigationHeight?: string;

  /**
   * The width of the navigation thumbnail can be provided in pixels.
   * The default value for the thumbnail height will be driven by the
   * thumbnail height.
   *
   * @default copies the `thumbHeight`
   */
  navigationWidth?: string;

  imageObjectFit?: 'none' | 'contain' | 'cover';
  navigationObjectFit?: 'none' | 'contain' | 'cover';

  /**
   * The number of items that are rendered per column.
   */
  gridItemsPerColumn?: number;
}

export const enum ProductImagesNavigationMouseEvent {
  Click = 'click',
  Mouseover = 'mouseover',
}

export const enum ProductImagesMainLayout {
  Carousel = 'carousel',
  Toggle = 'toggle',
  None = 'none',
}

export const enum ProductImagesNavigationPosition {
  Top = 'top',
  Start = 'start',
  End = 'end',
  Bottom = 'bottom',
}

export const enum ProductImagesNavigationLayout {
  Carousel = 'carousel',
  Grid = 'grid',
}

export const enum ProductImagesNavigationDisplay {
  Inline = 'inline',
  Floating = 'floating',
  None = 'none',
}

export const enum ProductImagesNavigationAlignment {
  Start = 'start',
  Center = 'center',
  End = 'end',
}

export const enum ProductImagesScrollBehavior {
  Smooth = 'smooth',
  Auto = 'auto',
  Disable = 'disable',
}
