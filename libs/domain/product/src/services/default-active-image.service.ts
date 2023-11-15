import { BehaviorSubject, Observable } from 'rxjs';
import { ActiveImageService } from './active-image.service';

export class DefaultActiveImageService implements ActiveImageService {
  protected items: Map<string, Map<string, BehaviorSubject<number>>> =
    new Map();

  get(sku: string, container = '0'): Observable<number | undefined> {
    let item = this.items.get(sku)?.get(container);
    if (!item) {
      this.set(sku, container);
      item = this.items.get(sku)?.get(container);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return item!;
  }

  set(sku: string, container = '0', active = 0): void {
    if (!this.items.get(sku)) {
      this.items.set(
        sku,
        new Map().set(container, new BehaviorSubject(active))
      );
    } else if (!this.items.get(sku)?.get(container)) {
      this.items.get(sku)?.set(container, new BehaviorSubject(active));
    } else {
      this.items.get(sku)?.get(container)?.next(active);
    }
  }
}
