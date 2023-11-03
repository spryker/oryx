import { LitElement, ReactiveController } from 'lit';
import { POPOVER_HEIGHT } from '../popover.model';

type Dimensions = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  boundingElementWidth: number;
  boundingElementHeight: number;
};

export class DimensionController implements ReactiveController {
  hostConnected?(): void;

  setBoundingBox(element: HTMLElement): void {
    const vOffset =
      (this.getComputedProperty(
        this.host,
        '--oryx-popover-vertical-offset'
      ) as number) ?? 0;

    const maxHeight =
      (this.getComputedProperty(
        this.host,
        '--oryx-popover-maxheight'
      ) as number) ?? POPOVER_HEIGHT;

    const maxWidth =
      (this.getComputedProperty(
        this.host,
        '--oryx-popover-maxwidth'
      ) as number) ?? 0;

    const {
      top,
      right,
      bottom,
      left,
      boundingElementWidth,
      boundingElementHeight,
    } = this.getAvailableSpace(element);

    const isRTL =
      getComputedStyle(document.documentElement).direction === 'rtl';

    this.host.toggleAttribute('rtl', isRTL);

    const toRight = left < maxWidth && right > left;
    const toLeft = right < maxWidth && left > right;

    this.host.toggleAttribute('up', bottom < maxHeight && top > bottom);
    this.host.toggleAttribute('end', (!isRTL && toRight) || (isRTL && toLeft));
    this.host.toggleAttribute(
      'start',
      (!isRTL && toLeft) || (isRTL && toRight)
    );

    const properties = {
      '--_available-popover-height': `${
        Math.max(bottom, top) - Number(vOffset)
      }px`,
      '--_available-popover-width-start': `${isRTL ? right : left}px`,
      '--_available-popover-width-end': `${isRTL ? left : right}px`,
      '--_bounding-element-width': `${boundingElementWidth}px`,
      '--_bounding-element-height': `${boundingElementHeight}px`,
    };

    this.setStyleProperties(properties);
  }

  protected setStyleProperties(properties: {
    [propName: string]: string;
  }): void {
    for (const propName in properties) {
      this.host.style.setProperty(
        propName,
        properties[propName as keyof typeof properties]
      );
    }
  }

  protected getAvailableSpace(element: HTMLElement): Dimensions {
    const { top, left, bottom, right, width, height } =
      element.getBoundingClientRect();

    return {
      top,
      left,
      bottom: window.innerHeight - bottom,
      right: window.innerWidth - right,
      boundingElementWidth: width,
      boundingElementHeight: height,
    };
  }

  protected getComputedProperty(
    element: Element,
    propName: string
  ): number | void {
    const property = window
      ?.getComputedStyle(element)
      .getPropertyValue(propName);

    if (!property) return;

    return parseFloat(property);
  }

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }
}
