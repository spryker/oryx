import { Size } from '@spryker-oryx/utilities';
import { LitElement, ReactiveController } from 'lit';
import { HeadingAttributes } from './heading.model';

/**
 * Controller responsible for managing typography styles based on host element attributes. The
 * typography styles are applied based on the provided typography or tag attribute.
 *
 * The styles are CSS variables that refer to design tokens.
 *
 * For responsive typography, the controller allows the application of styles based on different
 * screen sizes.
 */
export class TypographyController implements ReactiveController {
  constructor(protected host: LitElement & HeadingAttributes) {
    this.host.addController(this);
    this.applyStyles();
  }

  hostConnected?(): void;

  hostUpdate(): void {
    this.applyStyles();
  }

  protected applyStyles(): void {
    // const element =
    //   this.host.querySelector<HTMLElement>('*') ??
    //   this.host.shadowRoot?.querySelector<HTMLElement>('*');

    const tag = this.host.typography ?? this.host.as ?? this.host.tag;

    // element?.tagName.toLowerCase();
    if (tag) this.applyStyle(tag);
    if (this.host.lg) this.applyStyle(this.host.lg, Size.Lg);
    if (this.host.md) this.applyStyle(this.host.md, Size.Md);
    if (this.host.sm) this.applyStyle(this.host.sm, Size.Sm);
    console.log('maxLines', tag, this.host.maxLines);
    // if (this.host.maxLines)
    //   this.host.style.setProperty('--max-lines', String(this.host.maxLines));
  }

  protected applyStyle(tag: string, size?: Size): void {
    const screen = size ? `-${size}` : '';

    this.host.style.setProperty(
      `--_f${screen}`,
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
