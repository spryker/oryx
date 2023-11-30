import { Size } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import { HeadingAttributes, HeadingTag } from './heading.model';

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
    this.setStyle(this.host.lg, Size.Lg);
    this.setStyle(this.host.md, Size.Md);
    this.setStyle(this.host.sm, Size.Sm);

    this.setStyleProperty('--max-lines', undefined, String(this.host.maxLines));
  }

  protected setStyle(tag?: HeadingTag, size?: Size): void {
    if (!tag) return;

    this.setStyleProperty('--_s', size, `var(--oryx-typography-${tag}-size)`);
    this.setStyleProperty('--_w', size, `var(--oryx-typography-${tag}-weight)`);
    this.setStyleProperty('--_l', size, `var(--oryx-typography-${tag}-line)`);

    this.setStyleProperty(
      '--_d',
      size,
      tag === HeadingTag.None || tag === HeadingTag.Hide ? `none` : undefined
    );

    this.setStyleProperty(
      '--_t',
      size,
      tag === HeadingTag.Subtitle ? `uppercase` : undefined
    );
  }

  protected setStyleProperty(name: string, size?: Size, value?: string): void {
    const screen = size ? `-${size}` : '';

    if (value) {
      this.host.style.setProperty(`${name}${screen}`, value);
    } else {
      // remove in case of dynamic change (won't work at the server)
      this.host.style.removeProperty?.(`${name}${screen}`);
    }
  }
}
