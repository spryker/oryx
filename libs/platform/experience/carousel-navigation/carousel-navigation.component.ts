import { throttle } from '@spryker-oryx/utilities';
import { LitElement, PropertyValueMap, TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { carouselNavigationStyles } from './carousel-navigation.styles';

export class CarouselNavigationComponent extends LitElement {
  static styles = carouselNavigationStyles;

  protected resizeObserver?: ResizeObserver;

  @state() protected indicators: { n: number }[] = [];

  connectedCallback(): void {
    this.hostElement.addEventListener(
      'scroll',
      this.updateNavigation.bind(this)
    );
    this.resizeObserver = new ResizeObserver(
      throttle(
        () =>
          window.requestAnimationFrame(() => {
            this.updateNavigation.bind(this);
            this.calcIndicators();
          }),
        100
      )
    );
    this.resizeObserver.observe(this.hostElement);
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.removeEventListener('scroll', this.updateNavigation);
    this.resizeObserver?.unobserve(this.hostElement);
    this.resizeObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    setTimeout(() => {
      this.updateNavigation();
      this.calcIndicators();
    }, 2000);

    super.updated(changedProperties);
  }

  protected updateNavigation(): void {
    const elements = this.getCarouselItems();
    if (!elements.length) return;

    const indicators =
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>('input') ?? [];

    const scrollLeft = this.hostElement.scrollLeft;
    const clientWidth = this.hostElement.clientWidth;
    indicators.forEach((indicator, index) => {
      const slideStart = clientWidth * index;
      const distance = scrollLeft - slideStart;
      const per = distance / this.hostElement.clientWidth;
      const opacity = per >= 0 ? 1 - per : 1 + per;
      indicator.style.setProperty('--opacity', `${opacity}`);
    });

    this.toggleAttribute(
      'has-previous',
      this.hostElement.scrollLeft > elements?.[0]?.getBoundingClientRect().width
    );

    this.toggleAttribute(
      'has-next',
      this.hostElement.scrollLeft +
        this.hostElement.getBoundingClientRect().width <
        this.hostElement.scrollWidth -
          elements?.[elements.length - 1]?.getBoundingClientRect().width
    );
  }

  /**
   * calculates the indicators required to navigate the carousel.
   * Each "slide" will be represented by an indicator
   */
  protected calcIndicators(): void {
    this.style.setProperty('--width', `${this.hostElement.clientWidth}px`);

    const elements = this.getCarouselItems();
    if (!elements.length) return;

    const gap = parseFloat(
      window.getComputedStyle(this.hostElement).getPropertyValue('column-gap')
    );
    const slideCount = Math.ceil(
      (this.hostElement.scrollWidth + gap) /
        (this.hostElement.clientWidth + gap)
    );

    if (!slideCount || slideCount === this.indicators.length) return;

    this.indicators = [...Array(slideCount).keys()].map((i) => {
      const firstElementInSlide = elements.findIndex(
        (el) =>
          el.getBoundingClientRect().left >= i * this.hostElement.clientWidth //this.getBoundingClientRect().width
      );
      return { n: firstElementInSlide };
    });
  }

  protected override render(): TemplateResult | void {
    return html`<oryx-button
        icon="arrow_back"
        type="icon"
        class="previous"
        @click=${this.handlePrevious}
      ></oryx-button>
      <oryx-button
        icon="arrow_forward"
        type="icon"
        class="next"
        @click=${this.handleNext}
      ></oryx-button>

      ${when(
        this.indicators.length,
        () => html`
          <form class="indicators" onsubmit="return false;">
            ${this.indicators.map(
              (n) =>
                html` <input
                  value=${n.n}
                  type="radio"
                  name="indicators"
                  @input=${() => this.slide(n.n)}
                />`
            )}
          </form>
        `
      )}`;
  }

  protected slide(index: number): void {
    this.getCarouselItems()[index]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  }

  /**
   * Navigates to the previous slide.
   *
   * Supports alt-key, so that users can navigate to the first slide in 1 click.
   */
  protected handlePrevious(e: Event): void {
    const hostRect = this.hostElement.getBoundingClientRect();
    const elements = this.getCarouselItems();

    const index = (e as KeyboardEvent).altKey
      ? 0
      : elements.findIndex(
          (el) => el.getBoundingClientRect().left >= hostRect.left
        ) - 1;

    if (index > -1) {
      elements[index]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'end', // start
        block: 'nearest',
      });
    }
  }

  protected handleNext(e: Event): void {
    const hostRect = this.hostElement.getBoundingClientRect();
    const elements = this.getCarouselItems();
    const next = (e as KeyboardEvent).altKey
      ? elements[elements.length - 1]
      : elements.find(
          (el) =>
            el.getBoundingClientRect().left > hostRect.left + hostRect.width
        );
    const inline = 'start'; //start | nearest
    next?.scrollIntoView({
      behavior: 'smooth',
      inline: inline,
      block: 'nearest',
    });
  }

  protected get hostElement(): HTMLElement {
    return this.getRootNode().host as HTMLElement;
  }

  /**
   * Returns an array of the child elements that are listed in the carousel.
   */
  protected getCarouselItems(): HTMLElement[] {
    return Array.from(
      this.hostElement?.shadowRoot?.querySelectorAll<HTMLElement>(
        '*:not(:is(oryx-carousel-navigation,style,form.indicators,button,oryx-button, input)'
      ) ?? []
    );
  }
}
