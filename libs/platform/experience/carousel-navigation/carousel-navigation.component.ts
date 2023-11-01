import { IconTypes } from '@spryker-oryx/ui/icon';
import { throttle } from '@spryker-oryx/utilities';
import { LitElement, PropertyValueMap, TemplateResult, html } from 'lit';
import { property, queryAll, state } from 'lit/decorators.js';
import {
  ArrowNavigationBehavior,
  CarouselIndicatorAlignment,
  CarouselIndicatorPosition,
  CarouselLayoutProperties,
  CarouselScrollBehavior,
} from '../src/services';
import { carouselNavigationStyles } from './carousel-navigation.styles';

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
      this.hostElement.removeEventListener('scrollend', this.updateState);
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
          if (entry.isIntersecting) {
            this.buildNavigation();
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.intersectionObserver!.disconnect();
            this.initializeScrollListener();
            this.initializeResizeObserver();
          }
        });
      }, 300),
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
    const throttleTime = this.hostElement.clientWidth === 0 ? 0 : 100;
    this.resizeObserver = new ResizeObserver(
      throttle(() => {
        this.buildNavigation();
      }, throttleTime)
    );
    this.resizeObserver.observe(this.hostElement);
  }

  protected initializeScrollListener(): void {
    // if (this.scrollBehavior === CarouselScrollBehavior.Smooth) {
    this.throttledScrollListener = throttle(() => {
      this.updateState();
    }, 50);
    this.hostElement.addEventListener('scroll', this.throttledScrollListener);
    // }
    this.hostElement.addEventListener('scrollend', this.updateState.bind(this));
  }

  protected buildNavigation(): void {
    this.style.setProperty('--width', `${this.hostElement.clientWidth}px`);
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
   * Updates the state of the carousel indicators based on the current scroll position. The opacity
   * of the indicators is calculated based on the distance between the current scroll
   * position and the start of the slide.
   *
   * The method is called on scroll and on resize, to ensure that the state is always up to date.
   */
  protected updateIndicatorState(): void {
    if (!this.indicatorElements?.length || !this.showIndicators) return;
    const clientWidth = this.hostElement.clientWidth;
    const isRtl = window.getComputedStyle(this).direction === 'rtl';
    const scrollLeft = this.hostElement.scrollLeft * (isRtl ? -1 : 1);
    const scrollWidth = this.hostElement.scrollWidth;

    this.indicatorElements.forEach((indicator, index) => {
      const slideStart = clientWidth * index;
      const distance = scrollLeft - slideStart;
      const percentage = distance / this.hostElement.clientWidth;
      let opacity = percentage >= 0 ? 1 - percentage : 1 + percentage;
      if (clientWidth + scrollLeft >= scrollWidth) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (index === this.indicatorElements!.length - 1) {
          // we could consider making the previous slide indicator to 0
          // (opacity = index === this.indicatorElements!.length - 1 ? 1 : 0;)
          opacity = 1;
        }
      }
      indicator.style.setProperty('--opacity', `${opacity}`);
    });
  }

  /**
   * Updates the state of the carousel arrows based on the current scroll position. The method
   * is called on scroll and on resize, to ensure that the state is always up to date.
   */
  protected updateArrowState(): void {
    if (!this.items.length || !this.showArrows) return;
    const isRtl = window.getComputedStyle(this).direction === 'rtl';

    const scrollLeft = this.hostElement.scrollLeft * (isRtl ? -1 : 1);
    const scrollWidth = this.hostElement.scrollWidth;
    const firstItemWidth = this.items?.[0].getBoundingClientRect().width;
    const lastItemWidth =
      this.items?.[this.items.length - 1].getBoundingClientRect().width;

    this.toggleAttribute('has-previous', scrollLeft > firstItemWidth);

    this.toggleAttribute(
      'has-next',
      scrollLeft + this.hostElement.getBoundingClientRect().width <
        scrollWidth - lastItemWidth
    );
  }

  /**
   * Calculate and update indicators for the carousel based on its current state.
   */
  protected setSlides(): void {
    if (!this.items.length) return;

    const gap = parseFloat(
      window.getComputedStyle(this.hostElement).getPropertyValue('column-gap') // || '0'
    );

    const slideCount = Math.ceil(
      (this.hostElement.scrollWidth + gap) /
        (this.hostElement.clientWidth + gap)
    );

    if (slideCount === this.slides.length) return;

    if (!slideCount || slideCount === 1) {
      if (this.slides.length > 0) this.slides = [];
      return;
    }

    this.slides = [...Array(slideCount).keys()].map((i) => {
      const firstElementInSlide = this.items.findIndex((el) => {
        return (
          this.hostElement.scrollLeft + el.getBoundingClientRect().left >=
          i * this.hostElement.clientWidth
        );
      });
      return { index: firstElementInSlide };
    });
  }

  /**
   * @override Renders the navigation arrow buttons (previous/next) and indicators.
   */
  protected override render(): TemplateResult[] {
    const results: TemplateResult[] = [];

    if (this.showArrows) {
      results.push(html`<oryx-button
          icon=${IconTypes.Previous}
          type="icon"
          class="previous"
          @click=${this.handlePrevious}
        ></oryx-button>
        <oryx-button
          icon=${IconTypes.Next}
          type="icon"
          class="next"
          @click=${this.handleNext}
        ></oryx-button>`);
    }

    if (this.showIndicators) {
      results.push(html`<div class="indicators">
        ${this.slides.map(
          (slide) =>
            html`<input
              value=${slide.index}
              type="radio"
              name="indicators"
              @input=${this.handleIndicatorClick}
            />`
        )}
      </div>`);
    }

    return results;
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
      index =
        this.arrowNavigationBehavior === ArrowNavigationBehavior.Item
          ? this.items.findLastIndex(
              (el) => el.getBoundingClientRect().left < 0
            )
          : this.items.findIndex(
              (el) =>
                el.getBoundingClientRect().left >
                -this.hostElement.getBoundingClientRect().width
            );
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
      const isRtl = window.getComputedStyle(this).direction === 'rtl';

      const { left, width } = this.hostElement.getBoundingClientRect();
      if (isRtl) {
        index = this.items.findIndex((el) => {
          return el.getBoundingClientRect().left <= left;
        });
      } else {
        const x =
          this.arrowNavigationBehavior === ArrowNavigationBehavior.Item
            ? left + 10
            : left + width;
        index = this.items.findIndex(
          (el) => el.getBoundingClientRect().left > x
        );
      }
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

    const scrollPosition = isRtl
      ? -(hostRect.right - targetElementRect.right)
      : targetElementRect.left - hostRect.left;

    const behavior =
      this.scrollBehavior === CarouselScrollBehavior.Smooth ? 'smooth' : 'auto';

    this.hostElement.scrollTo({
      left: this.hostElement.scrollLeft + scrollPosition,
      behavior,
    });
  }

  protected get hostElement(): HTMLElement {
    return this.getRootNode().host as HTMLElement;
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
    if (this.arrowNavigationBehavior === ArrowNavigationBehavior.Item) {
      this.items.forEach((item) => {
        item.style.scrollSnapAlign = 'start';
      });
    } else {
      if (!this.slides.length) this.setSlides();
      this.slides.forEach((indicator) => {
        if (this.items[indicator.index]) {
          this.items[indicator.index].style.scrollSnapAlign = 'start';
        }
      });
    }
  }
}
