import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydrate, throttle } from '@spryker-oryx/utilities';
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

@hydrate({ event: 'window:load' })
export class CarouselNavigationComponent
  extends LitElement
  implements CarouselLayoutProperties
{
  static styles = carouselNavigationStyles;

  @property({ type: Boolean }) vertical?: boolean;
  @property({ type: Boolean }) showArrows?: boolean;
  @property({ type: Boolean }) showIndicators?: boolean;
  @property({ type: Boolean }) scrollWithMouse?: boolean;
  @property({ type: Boolean }) scrollWithTouch?: boolean;
  @property({ reflect: true })
  arrowNavigationBehavior?: ArrowNavigationBehavior;
  @property({ reflect: true }) indicatorsPosition?: CarouselIndicatorPosition;
  @property({ reflect: true }) indicatorsAlignment?: CarouselIndicatorAlignment;
  @property({ reflect: true }) scrollBehavior?: CarouselScrollBehavior;

  @state() protected items: HTMLElement[] = [];
  @state() protected slides: number[] = [];
  @queryAll('input') protected indicatorElements?: NodeListOf<HTMLInputElement>;

  protected throttleTime = 150;
  protected mutationObserver?: MutationObserver;
  protected resizeObserver?: ResizeObserver;
  protected isIntersected = false;
  protected intersectionObserver?: IntersectionObserver;
  protected scrollListener?: () => void;

  /**
   * @override Initialize the intersection observer. The intersection observer is
   * used to detect when the carousel becomes visible and sets the resize observer
   * and listens to scroll events to always keep the state up to date.
   */
  connectedCallback(): void {
    this.initializeMutationObserver();
    this.initializeIntersectionObserver();
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.mutationObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.resizeObserver?.disconnect();
    if (this.scrollListener) {
      this.hostElement?.removeEventListener('scroll', this.scrollListener);
    }
    super.disconnectedCallback();
  }

  /**
   * Initializes the IntersectionObserver to detect when the carousel becomes visible.
   * This is necessary to calculate the carousel's width and to build the navigation.
   */
  protected initializeIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      throttle(
        (entries: IntersectionObserverEntry[]) => {
          return entries.forEach(() => {
            this.isIntersected = true;
            if (this.resolveItems().length) {
              this.buildNavigation();
              this.initializeScrollListener();
              this.initializeResizeObserver();
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              this.intersectionObserver!.disconnect();
            }
          });
        },
        this.throttleTime,
        true
      ),
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );
    this.intersectionObserver.observe(this.hostElement);
  }

  protected initializeMutationObserver(): void {
    this.mutationObserver = new MutationObserver(() => {
      if (!this.isIntersected) return;
      this.buildNavigation();
      this.initializeScrollListener();
      this.initializeResizeObserver();
    });
    const shadowRoot = this.getRootNode();
    if (shadowRoot instanceof ShadowRoot) {
      this.mutationObserver.observe(shadowRoot, {
        childList: true,
        subtree: true,
      });
    }
  }

  /**
   * Initializes the ResizeObserver to detect when the carousel's width changes.
   * This is necessary to recalculate the carousel's width and build the navigation.
   */
  protected initializeResizeObserver(): void {
    if (this.resizeObserver) return;
    this.resizeObserver = new ResizeObserver(
      throttle(
        (entries: ResizeObserverEntry[]) => {
          window.requestAnimationFrame((): void => {
            if (!Array.isArray(entries) || !entries.length) return;
            this.buildNavigation();
          });
        },
        this.throttleTime,
        true
      )
    );
    this.resizeObserver.observe(this.hostElement);
  }

  protected initializeScrollListener(): void {
    this.scrollListener = throttle(
      () => {
        this.updateState();
      },
      this.throttleTime,
      true
    );
    this.hostElement.addEventListener('scroll', this.scrollListener);
  }

  protected buildNavigation(): void {
    this.style.setProperty(
      '--width',
      `${getDimensions(this.hostElement).size}px`
    );
    this.style.setProperty(
      '--height',
      `${getDimensions(this.hostElement, true).size}px`
    );

    const items = this.resolveItems();
    if (
      items.length !== this.items.length ||
      !items.find((e, index) => !e.isEqualNode(this.items[index]))
    ) {
      this.items = items;
      this.setScrollSnap();
      this.setSlides();
    }
  }

  protected updated(
    changes:
      | PropertyValueMap<CarouselNavigationComponent>
      | Map<PropertyKey, unknown>
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

    this.setScrollSnap();

    const hostScroll = getScrollDimensions(this.hostElement, this.isVertical);
    const hostDimensions = getDimensions(this.hostElement, this.isVertical);
    const itemDimensions = getDimensions(this.items?.[0], this.isVertical);

    this.toggleAttribute(
      'has-previous',
      hostScroll.position > itemDimensions.size
    );

    this.toggleAttribute(
      'has-next',
      hostScroll.position + hostDimensions.size <=
        hostScroll.size - itemDimensions.size
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
      indicator.checked = opacity === 1;
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
      return firstElementInSlide;
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
          <div class="indicators" @input=${this.handleIndicatorInput}>
            ${this.slides.map(
              (slide) =>
                html`<input value=${slide} type="radio" name="indicators" />`
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
              return (
                dimensions.position + hostDimensions.position >
                -hostDimensions.size
              );
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
   *
   * @param @deprecated use handleIndicatorChange instead
   */
  protected handleIndicatorClick(e: Event): void {
    this.handleIndicatorInput(e);
  }

  /**
   * Handles the selected state of an indicator.
   */
  protected handleIndicatorInput(e: Event): void {
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
    const result: HTMLElement[] = [];

    const items = [
      ...Array.from(this.hostElement.shadowRoot?.children ?? []),
      ...this.hostElement.children,
    ].filter(
      (e) =>
        !['style', 'oryx-carousel-navigation'].includes(e.tagName.toLowerCase())
    );

    for (const item of items) {
      // If the display is 'contents' we collect all the child elements to the result
      if (window.getComputedStyle(item).display === 'contents') {
        result.push(
          ...Array.from((item.shadowRoot?.children ?? []) as HTMLElement[])
        );
      } else {
        result.push(item as HTMLElement);
      }
    }

    return result;
  }

  protected setScrollSnap(): void {
    this.items.forEach((item, index) => {
      const hasMatch = this.slides.find((slide) => slide === index) ?? -1;
      const align =
        this.arrowNavigationBehavior === ArrowNavigationBehavior.Item ||
        hasMatch > -1
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
