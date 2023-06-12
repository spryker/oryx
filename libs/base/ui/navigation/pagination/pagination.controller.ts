import { LitElement, ReactiveController } from 'lit';
import { PaginationProperties } from './pagination.model';

export class PaginationController implements ReactiveController {
  hostConnected?(): void;

  hostUpdate(): void {
    this.paginate(this.host.pages);
  }

  getPrevious(pages: Array<HTMLElement> = []): HTMLElement {
    return pages[this.host.current - 2];
  }

  getNext(pages: Array<HTMLElement> = []): HTMLElement {
    return pages[this.host.current];
  }

  paginate(pages: HTMLElement[] = []): void {
    if (pages.length === 0) return;

    this.ensureCurrent(pages);
    this.setActive(pages);

    const range = this.getRange(pages.length);

    pages.forEach((page, i) => {
      const isFirst = i === 0;
      const isLast = i === pages.length - 1;
      const isInRange = i + 1 >= range.start && i + 1 <= range.end;
      page.toggleAttribute('visible', isFirst || isInRange || isLast);
    });

    this.setTruncated(pages);
  }

  protected setTruncated(pages: HTMLElement[]): void {
    this.host.toggleAttribute(
      'start-truncated',
      !pages[1]?.hasAttribute('visible')
    );

    this.host.toggleAttribute(
      'end-truncated',
      !pages[pages.length - 2]?.hasAttribute('visible') &&
        !(
          this.host.max === 1 &&
          (this.host.current === pages.length || this.host.current === 1)
        )
    );
  }

  protected getRange(length: number): { start: number; end: number } {
    let start = this.host.current - (this.host.max - 1) / 2;
    if (this.host.current < this.host.max) {
      start = 1;
    }
    if (this.host.current - 1 > length - this.host.max) {
      start = length - this.host.max + 1;
    }
    return {
      start,
      end: start + this.host.max - 1,
    };
  }

  protected setActive(pages: HTMLElement[]): void {
    this.host.querySelectorAll('[active]').forEach((el) => {
      el.removeAttribute('active');
      el.removeAttribute('inert');
    });

    pages[this.host.current - 1].toggleAttribute('active');
    pages[this.host.current - 1].toggleAttribute('inert');
  }

  protected ensureCurrent(pages: HTMLElement[]): void {
    if (!this.host.current || this.host.current < 1) {
      this.host.current = 1;
    }

    if (this.host.current > pages.length - 1) {
      this.host.current = pages.length;
    }
  }

  constructor(protected host: PaginationProperties & LitElement) {
    this.host.addController(this);
  }
}
