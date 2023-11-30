import { Size } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import {
  HeadingAttributes,
  HeadingTag,
  HeadingVisibility,
} from './heading.model';

export class TypographyController implements ReactiveController {
  hostConnected?(): void;

  hostUpdate(): void {
    this.setStyles();
  }

  constructor(protected host: HeadingAttributes & LitElement) {
    this.host.addController(this);
  }

  /**
   * Sets the (responsive) typography styles based on the provided attributes
   * on the host.
   */
  protected setStyles(): void {
    const tag = this.host.typography ?? this.host.as ?? this.host.tag;
    this.setStyle(tag as HeadingTag);
    const globalNone =
      this.host.typography === HeadingVisibility.None ||
      this.host.typography === HeadingVisibility.Hide
        ? HeadingVisibility.None
        : undefined;
    this.setStyle(this.host.lg ?? globalNone, Size.Lg);
    this.setStyle(this.host.md ?? globalNone, Size.Md);
    this.setStyle(this.host.sm ?? globalNone, Size.Sm);
  }

  protected setStyle(tag?: HeadingTag | HeadingVisibility, size?: Size): void {
    if (!tag) return;

    this.setStyleProperty('--_s', size, `var(--oryx-typography-${tag}-size)`);
    this.setStyleProperty('--_w', size, `var(--oryx-typography-${tag}-weight)`);
    this.setStyleProperty('--_l', size, `var(--oryx-typography-${tag}-line)`);

    this.setStyleProperty(
      '--_t',
      size,
      tag === HeadingTag.Subtitle ? `uppercase` : undefined
    );

    if (size) {
      this.setStyleProperty(
        '--_d',
        size,
        tag === HeadingVisibility.None ? `none` : undefined
      );
    }
  }

  protected setStyleProperty(
    name: string,
    size?: Size,
    value?: string | number
  ): void {
    const screen = size ? `-${size}` : '';

    if (value !== undefined) {
      this.host.style.setProperty(`${name}${screen}`, String(value));
    } else {
      // remove in case of dynamic change (won't work at the server)
      this.host.style.removeProperty?.(`${name}${screen}`);
    }
  }
}
