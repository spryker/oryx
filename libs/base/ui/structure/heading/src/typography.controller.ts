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

    this.setStyleProperty('--max-lines', undefined, this.host.maxLines);
  }

  protected setStyle(tag?: HeadingTag | HeadingVisibility, size?: Size): void {
    this.setFont(tag, size);
    this.setDisplay(tag, size);
    this.setTransform(tag, size);
  }

  /**
   * Sets the font properties for the heading, based on the provided tag and size.
   */
  protected setFont(tag?: HeadingTag | HeadingVisibility, size?: Size): void {
    if (!tag) return;

    this.setStyleProperty('--_s', size, `var(--oryx-typography-${tag}-size)`);
    this.setStyleProperty('--_w', size, `var(--oryx-typography-${tag}-weight)`);
    this.setStyleProperty('--_l', size, `var(--oryx-typography-${tag}-line)`);
  }

  /**
   * Sets the display property for the heading, based on the provided tag and size.
   * When no tag is provided, the default display is `inline`.
   * When no size is provided, the default display is `inline-block`.
   *
   */
  protected setDisplay(
    tag?: HeadingTag | HeadingVisibility,
    size?: Size
  ): void {
    if (!tag || (!size && this.isInlineStyle(tag))) {
      this.setStyleProperty('--_d', undefined, 'inline-block');
    } else {
      this.setStyleProperty(
        '--_d',
        size,
        tag === HeadingVisibility.None ? `none` : undefined
      );
    }
  }

  /**
   * Sets the text-transform property for the heading, based on the provided tag and size.
   */
  protected setTransform(
    tag?: HeadingTag | HeadingVisibility,
    size?: Size
  ): void {
    if (tag === HeadingTag.Subtitle) {
      this.setStyleProperty('--_t', size, `uppercase`);
    }
  }

  /**
   * Adds the property to the styles for the given screen size. When there is no
   * value available, the property is removed, to ensure it works dynamically.
   * Removing properties wont work at the server, which is fine, as it is supposed
   * to be dynamic, at runtime only.
   */
  protected setStyleProperty(
    name: string,
    size?: Size,
    value?: string | number
  ): void {
    const propName = `${name}${size ? `-${size}` : ''}`;

    if (value !== undefined) {
      this.host.style.setProperty(propName, String(value));
    } else {
      this.host.style.removeProperty(propName);
    }
  }

  protected isInlineStyle(tag?: HeadingTag | HeadingVisibility): boolean {
    return [HeadingTag.Strong, HeadingTag.Bold, HeadingTag.Small].includes(
      tag as HeadingTag
    );
  }
}
