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

    if (this.host.maxLines) {
      this.host.style.setProperty('--max-lines', String(this.host.maxLines));
    } else {
      // ssrShim does not support setting a property to undefined, so we need to
      // set an artificial value for now.
      this.host.style.setProperty('--max-lines', '0');
    }
  }

  protected setStyle(tag?: HeadingTag, size?: Size): void {
    if (!tag) return;
    const screen = size ? `-${size}` : '';

    if (tag === HeadingTag.None || tag === HeadingTag.Hide) {
      this.host.style.setProperty(`--_d${screen}`, `none`);
      return;
    }

    if (tag === HeadingTag.Subtitle) {
      this.host.style.setProperty(`--_t${screen}`, `uppercase`);
      return;
    }

    this.host.style.setProperty(
      `--_s${screen}`,
      `var(--oryx-typography-${tag}-size)`
    );
    this.host.style.setProperty(
      `--_w${screen}`,
      `var(--oryx-typography-${tag}-weight)`
    );
    this.host.style.setProperty(
      `--_l${screen}`,
      `var(--oryx-typography-${tag}-line)`
    );
  }
}
