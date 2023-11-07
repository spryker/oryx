import { IconTypes } from '@spryker-oryx/ui/icon';
import { throttle } from '@spryker-oryx/utilities';
import { LitElement, PropertyValueMap, TemplateResult, html } from 'lit';
import { property, queryAll, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import {
  ArrowNavigationBehavior,
  CarouselIndicatorAlignment,
  CarouselIndicatorPosition,
  CarouselLayoutProperties,
  CarouselScrollBehavior,
} from '../src/services';
import { carouselNavigationStyles } from './carousel-navigation.styles';
import {
  findLastIndexCondition,
  getComputedGapInPixels,
  getDimensions,
  getScrollDimensions,
} from './util';

export class CarouselNavigationComponent
  extends LitElement
  implements CarouselLayoutProperties
{
  static styles = carouselNavigationStyles;

  @property({ type: Boolean }) showArrows?: boolean;
  @property({ type: Boolean }) showIndicators?: boolean;
  @property() arrowNavigationBehavior?: ArrowNavigationBehavior;
  @property({ reflect: true }) indicatorsPosition?: CarouselIndicatorPosition;
  @property({ reflect: true }) indicatorsAlignment?: CarouselIndicatorAlignment;
  @property() scrollBehavior?: CarouselScrollBehavior;

  protected resizeObserver?: ResizeObserver;
  protected intersectionObserver?: IntersectionObserver;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected throttledScrollListener: () => void = () => {};

  protected intersectionThrottleTime = 150;
  protected scrollThrottleTime = 50;

  @state() protected items: HTMLElement[] = [];
  @state() protected slides: { index: number }[] = [];

  @queryAll('input') protected indicatorElements?: NodeListOf<HTMLInputElement>;

  /**
   * @override Initialize the intersection observer. The intersection observer is
   * used to detect when the carousel becomes visible and sets the resize observer
   * and listens to scroll events to always keep the state up to date.
   */
  connectedCallback(): void {
    this.initializeIntersectionObserver();
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    if (this.hostElement) {
      this.hostElement.removeEventListener(
        'scroll',
        this.throttledScrollListener
      );
      this.hostElement.removeEventListener(
        'scrollend',
        this.throttledScrollListener
      );
    }
    super.disconnectedCallback();
  }

  /**
   * Initializes the IntersectionObserver to detect when the carousel becomes visible.
   * This is necessary to calculate the carousel's width and to build the navigation.
   */
  protected initializeIntersectionObserver(): void {
    if (this.intersectionObserver) return;

    this.intersectionObserver = new IntersectionObserver(
      throttle((entries: IntersectionObserverEntry[]) => {
        return entries.forEach((entry) => {
          if (this.resolveItems().length) {
            this.buildNavigation();
            this.initializeScrollListener();
            this.initializeResizeObserver();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.intersectionObserver!.disconnect();
          }
        });
      }, this.intersectionThrottleTime),
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );
    this.intersectionObserver.observe(this.hostElement);
  }

  /**
   * Initializes the ResizeObserver to detect when the carousel's width changes.
   * This is necessary to recalculate the carousel's width and build the navigation.
   */
  protected initializeResizeObserver(): void {
    if (this.resizeObserver) return;
    const throttleTime = this.hostElement.clientWidth
      ? this.intersectionThrottleTime
      : 0;
    this.resizeObserver = new ResizeObserver(
      throttle(() => {
        this.buildNavigation();
      }, throttleTime)
    );
    this.resizeObserver.observe(this.hostElement);
  }

  protected initializeScrollListener(): void {
    this.throttledScrollListener = throttle(() => {
      this.updateState();
    }, this.scrollThrottleTime);
    this.hostElement.addEventListener('scroll', this.throttledScrollListener);
    this.hostElement.addEventListener(
      'scrollend',
      this.throttledScrollListener
    );
  }

  protected buildNavigation(): void {
    this.style.setProperty('--width', `${this.hostElement.clientWidth}px`);
    this.style.setProperty('--height', `${this.hostElement.clientHeight}px`);
    if (this.showIndicators)
      this.hostElement.style.setProperty('margin-block-end', '50px');

    const items = this.resolveItems();
    if (
      items.length !== this.items.length ||
      !items.find((e, index) => !e.isEqualNode(this.items[index]))
    ) {
      this.items = items;
      this.setScrollSnap();
      if (this.showIndicators) this.setSlides();
    }
  }

  protected updated(
    changes: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changes.has('showIndicators') && this.showIndicators) {
      this.buildNavigation();
    }
    this.updateState();
    super.updated(changes);
  }

  protected updateState(): void {
    this.updateArrowState();
    this.updateIndicatorState();
  }

  /**
   * Updates the state of the carousel arrows based on the current scroll position. The method
   * is called on scroll and on resize, to ensure that the state is always up to date.
   */
  protected updateArrowState(): void {
    if (!this.items.length || !this.showArrows) return;

    this.toggleAttribute(
      'has-previous',
      getScrollDimensions(this.hostElement, this.isVertical).position >
        getDimensions(this.items?.[0], this.isVertical).size
    );

    this.toggleAttribute(
      'has-next',
      getScrollDimensions(this.hostElement, this.isVertical).position +
        this.hostElement.getBoundingClientRect().width <
        getScrollDimensions(this.hostElement, this.isVertical).size -
          getDimensions(this.items?.[0], this.isVertical).size
    );
  }

  /**
   * Updates the state of the carousel indicators based on the current scroll position. The opacity
   * of the indicators is calculated based on the distance between the current scroll
   * position and the start of the slide.
   *
   * The method is called on scroll and on resize, to ensure that the state is always up to date.
   */
  protected updateIndicatorState(): void {
    if (!this.indicatorElements?.length || !this.showIndicators) return;
    const clientDimension = this.isVertical
      ? this.hostElement.clientHeight
      : this.hostElement.clientWidth;
    const scrollDimensions = getScrollDimensions(
      this.hostElement,
      this.isVertical
    );

    this.indicatorElements.forEach((indicator, index) => {
      const slideStart = clientDimension * index;
      const distance = scrollDimensions.position - slideStart;
      const percentage = distance / clientDimension;
      let opacity = percentage >= 0 ? 1 - percentage : 1 + percentage;
      if (
        clientDimension + scrollDimensions.position >= scrollDimensions.size &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        index === this.indicatorElements!.length - 1
      ) {
        opacity = 1;
      }
      indicator.style.setProperty('--opacity', `${opacity}`);
    });
  }

  /**
   * Calculate and update indicators for the carousel based on its current state.
   */
  protected setSlides(): void {
    if (!this.items.length) return;

    const gap = getComputedGapInPixels(this.hostElement, this.isVertical);

    const scrollD = this.isVertical
      ? this.hostElement.scrollHeight
      : this.hostElement.scrollWidth;
    const scrollX = this.isVertical
      ? this.hostElement.scrollTop
      : this.hostElement.scrollLeft;
    const clientD = this.isVertical
      ? this.hostElement.clientHeight
      : this.hostElement.clientWidth;

    const slideCount = Math.ceil((scrollD + gap) / (clientD + gap));

    if (slideCount === this.slides.length) return;

    if (!slideCount || slideCount === 1) {
      if (this.slides.length > 0) this.slides = [];
      return;
    }

    this.slides = [...Array(slideCount).keys()].map((i) => {
      const firstElementInSlide = this.items.findIndex((el) => {
        const y = this.isVertical
          ? el.getBoundingClientRect().top
          : el.getBoundingClientRect().left;
        return scrollX + y >= i * clientD;
      });
      return { index: firstElementInSlide };
    });
  }

  /**
   * @override Renders the navigation arrow buttons (previous/next) and indicators.
   */
  protected override render(): TemplateResult {
    return html`
      ${when(
        this.showArrows,
        () => html` <oryx-button
            icon=${this.isVertical
              ? IconTypes.ArrowUpward
              : IconTypes.ArrowBackward}
            type="icon"
            class="previous"
            @click=${this.handlePrevious}
          ></oryx-button>
          <oryx-button
            icon=${this.isVertical
              ? IconTypes.ArrowDownward
              : IconTypes.ArrowForward}
            type="icon"
            class="next"
            @click=${this.handleNext}
          ></oryx-button>`
      )}
      ${when(
        this.showIndicators,
        () => html`
          <div class="indicators">
            ${this.slides.map(
              (slide) =>
                html`<input
                  value=${slide.index}
                  type="radio"
                  name="indicators"
                  @input=${this.handleIndicatorClick}
                />`
            )}
          </div>
        `
      )}
    `;
  }

  /**
   * Handles the action of scrolling to the previous item.
   *
   * When the alt-key is pressed, it will scroll all the way to the first item.
   */
  protected handlePrevious(e: Event): void {
    let index;
    if ((e as KeyboardEvent).altKey) {
      index = 0;
    } else {
      const hostDimensions = getDimensions(this.hostElement, this.isVertical);

      index =
        this.arrowNavigationBehavior === ArrowNavigationBehavior.Item
          ? // findLastIndex not yet supported by our compiler
            findLastIndexCondition(this.items, (el) => {
              return (
                getDimensions(el, this.isVertical).position <
                hostDimensions.position
              );
            })
          : this.items.findIndex((el) => {
              const dimensions = getDimensions(el, this.isVertical);
              return dimensions.position > -hostDimensions.size;
            });
    }
    this.scrollElementToIndex(index);
  }

  /**
   * Navigates to the next slide.
   *
   * Supports alt-key, so that users can navigate to the first slide in 1 click.
   */
  protected handleNext(e: Event): void {
    let index;

    if ((e as KeyboardEvent).altKey) {
      index = this.items.length - 1;
    } else {
      const dimensions = getDimensions(this.hostElement, this.isVertical);
      const offset =
        this.arrowNavigationBehavior === ArrowNavigationBehavior.Item
          ? dimensions.position
          : dimensions.position + dimensions.size;
      index = this.items.findIndex(
        (el) => getDimensions(el, this.isVertical).position > offset
      );
    }

    this.scrollElementToIndex(index);
  }

  /**
   * Handles the click on an indicator.
   */
  protected handleIndicatorClick(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.scrollElementToIndex(parseInt(target.value));
  }

  /**
   * Scrolls the carousel to the given index.
   */
  protected scrollElementToIndex(targetIndex: number): void {
    const targetElement = this.items[targetIndex];
    if (!targetElement) return;

    const hostRect = this.hostElement.getBoundingClientRect();
    const targetElementRect = targetElement.getBoundingClientRect();

    const isRtl = window.getComputedStyle(this).direction === 'rtl';

    const scrollPosition = this.isVertical
      ? targetElementRect.top - hostRect.top
      : isRtl
      ? -(hostRect.right - targetElementRect.right)
      : targetElementRect.left - hostRect.left;

    const behavior =
      this.scrollBehavior === CarouselScrollBehavior.Smooth ? 'smooth' : 'auto';

    if (this.isVertical) {
      this.hostElement.scrollTo({
        top: this.hostElement.scrollTop + scrollPosition,
        behavior,
      });
    } else {
      this.hostElement.scrollTo({
        left: this.hostElement.scrollLeft + scrollPosition,
        behavior,
      });
    }
  }

  /**
   * Resolves all the carousel items. Carousel items can be rendered inside a composition
   * or assigned to the main slot.
   *
   * The items can be listed inside a wrapper component, e.g. inside the product list component.
   * In this case, the wrapper is supposed to have a 'display: contents' CSS property.
   *
   * Limitations: The composition layout supports individual order of components by setting the
   * gridColumn (e.g., `gridColumn: 2`). This method will, however, not take this rendered order
   * into account. There's currently no stable API to distinguish between the rendered order and
   * the source order, but it will come: https://developer.chrome.com/blog/reading-order/.
   *
   * @returns An array of HTMLElements representing the child elements of the host component.
   */
  protected resolveItems(): HTMLElement[] {
    const query =
      '*:not(:is(oryx-carousel-navigation,slot,style,.indicators,button,oryx-button, input)';

    const items = [
      ...(this.hostElement?.shadowRoot?.querySelectorAll(query) ?? []),
      ...(this.hostElement?.querySelectorAll(query) ?? []),
    ];

    const result: HTMLElement[] = [];

    for (const item of items) {
      if (window.getComputedStyle(item).display === 'contents') {
        // If the display is 'contents' we collect all the child elements to the result
        result.push(
          ...Array.from(
            (item.shadowRoot?.querySelectorAll(query) ?? []) as HTMLElement[]
          )
        );
      } else {
        result.push(item as HTMLElement);
      }
    }

    return result;
  }

  protected setScrollSnap(): void {
    this.items.forEach((item, index) => {
      const align =
        this.arrowNavigationBehavior === ArrowNavigationBehavior.Item ||
        this.slides.find((slide) => slide.index === index)
          ? 'start'
          : 'none';
      item.style.scrollSnapAlign = align;
    });
  }

  protected get isVertical(): boolean {
    return this.hasAttribute('vertical');
  }

  protected get hostElement(): HTMLElement {
    return this.getRootNode().host as HTMLElement;
  }
}
