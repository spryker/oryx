import { LitElement, ReactiveController } from 'lit';
import {
  POPOVER_HEIGHT_MARGIN,
  POPOVER_MAX_HEIGHT_FALLBACK,
} from '../popover.model';

export class MaxHeightController implements ReactiveController {
  hostConnected?(): void;

  setBoundingBox(element: HTMLElement): void {
    const maxHeight = this.getMaxHeight(element);
    const available = this.getAvailableSpace(element);

    this.host.toggleAttribute(
      'up',
      available.bottom < maxHeight && available.top > available.bottom
    );

    this.host.style.setProperty(
      '--_available-popover-height',
      `${Math.max(available.bottom, available.top) - POPOVER_HEIGHT_MARGIN}px`
    );
  }

  protected getAvailableSpace(element: HTMLElement): {
    top: number;
    bottom: number;
  } {
    return {
      top: element.getBoundingClientRect().top,
      bottom: window.innerHeight - element.getBoundingClientRect().bottom,
    };
  }

  protected getMaxHeight(element: Element): number {
    const property = window
      ?.getComputedStyle(element)
      .getPropertyValue('--oryx-popover-maxheight');

    if (property === '') {
      return POPOVER_MAX_HEIGHT_FALLBACK;
    }

    return Number(property.split('px')[0]);
  }

  constructor(protected host: LitElement) {
    this.host.addController(this);
  }
}
