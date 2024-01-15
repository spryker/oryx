import { PreviewExperienceService } from '@spryker-oryx/experience';
import {
  effect,
  elementEffect,
  featureVersion,
  observe,
  signal,
  subscribe,
} from '@spryker-oryx/utilities';
import { query } from 'lit/decorators.js';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { CompositionComponent } from './composition.component';
import { compositionPreviewStyles } from './composition.styles';

const EB_PREVIEW_FOCUS_CLASS = 'eb-preview-focus';

export class CompositionPreviewComponent extends CompositionComponent {
  static styles = [compositionPreviewStyles];

  @query(`.${EB_PREVIEW_FOCUS_CLASS}`)
  protected focusedComponent?: HTMLElement;

  protected $interaction = signal(
    (this.experienceService as PreviewExperienceService)?.getInteractionData()
  );

  @elementEffect()
  protected $selectedComponent = effect(() => {
    const actions = ['mouseover', 'click', 'mouseout', 'add'];
    const interaction = this.$interaction();

    if (!actions.includes(interaction?.action)) {
      return;
    }

    const focusedNameAttr = 'name';
    const targetComponent = this.shadowRoot?.querySelector<HTMLElement>(
      ` [uid='${interaction.component.id}']`
    );

    if (featureVersion >= '1.4') {
      if (targetComponent) {
        this.setOutlineRect(targetComponent, interaction);
      }
    } else {
      if (
        targetComponent &&
        getComputedStyle(targetComponent).display === 'inline'
      ) {
        (targetComponent as HTMLElement)?.style.setProperty('display', 'block');
      }
      this.focusedComponent?.classList.remove(EB_PREVIEW_FOCUS_CLASS);
      this.focusedComponent?.removeAttribute(focusedNameAttr);
      this.focusedComponent?.style.removeProperty('display');

      if (interaction.action !== 'mouseout') {
        targetComponent?.classList.add(EB_PREVIEW_FOCUS_CLASS);
        targetComponent?.setAttribute(
          focusedNameAttr,
          interaction.component.name
        );
      }
    }
  });

  /**
   * @deprecated since 1.2, will be removed.
   */
  @observe()
  protected uid$ = new BehaviorSubject<string | undefined>(this.uid);

  /**
   * @deprecated since 1.2, will be removed.
   */
  @observe()
  protected route$ = new BehaviorSubject<string | undefined>(this.route);

  /**
   * @deprecated since 1.2, will be removed.
   */
  protected routeDriven = false;

  /**
   * @deprecated since 1.2, will be removed.
   */
  @subscribe()
  protected $uidFromRoute2 = this.route$.pipe(
    filter((route) => !!route),
    tap((route) => {
      const headerEdit$ = (this.experienceService as PreviewExperienceService)
        .headerEdit$;
      if (route) {
        if (route === '/_header' || route === '/_footer') {
          if (!headerEdit$.value) {
            this.routeDriven = true;
            headerEdit$.next(true);
          }
        } else if (headerEdit$.value) {
          this.routeDriven = false;
          headerEdit$.next(false);
        }
      }
    })
  );

  /**
   * @deprecated since 1.2, will be removed.
   */
  protected components$ = this.uid$.pipe(
    switchMap((uid) => {
      const headerEdit$ = (this.experienceService as PreviewExperienceService)
        .headerEdit$;

      const component = this.componentsController
        .getComponents()
        .pipe(catchError(() => of([])));

      if (!this.routeDriven && (uid === 'header' || uid === 'footer')) {
        return component.pipe(
          switchMap((components) =>
            headerEdit$.pipe(map((edit) => (edit ? [] : components)))
          )
        );
      }
      return component;
    }),
    tap(console.log)
  );

  /**
   * Sets CSS class and variables for the preview outline. The
   * outline is used to highlight the currently selected component.
   * The rect is calculated based on the element's bounding rect, which
   * is different for different display types, such as `display:contents`
   * or `position:absolute`.
   */
  protected setOutlineRect(element: HTMLElement, interaction: any): void {
    const { display } = window.getComputedStyle(element);

    let { left, top, width, height } = element.getBoundingClientRect();
    const { scrollTop, scrollLeft } = window.document.documentElement;

    if (display === 'contents') {
      const children = element.shadowRoot?.querySelectorAll('*:not(style)');

      let outerLeft = Infinity;
      let outerTop = Infinity;
      let outerRight = 0;
      let outerBottom = 0;

      Array.from(children ?? []).forEach((e) => {
        const {
          left: l,
          top: t,
          right: r,
          bottom: b,
        } = e.getBoundingClientRect();
        if (l < outerLeft) outerLeft = l;
        if (t < outerTop) outerTop = t;
        if (r > outerRight) outerRight = r;
        if (b > outerBottom) outerBottom = b;
      });

      if (outerLeft !== Infinity) left = outerLeft;
      if (outerTop !== Infinity) top = outerTop;
      if (outerRight !== Infinity) width = outerRight - outerLeft;
      if (outerBottom !== Infinity) height = outerBottom - outerTop;
    }

    element.style.setProperty('--ebp-top', `${top + scrollTop}px`);
    element.style.setProperty('--ebp-left', `${left + scrollLeft}px`);
    element.style.setProperty('--ebp-width', `${width}px`);
    element.style.setProperty('--ebp-height', `${height}px`);

    if (interaction.action === 'mouseout') {
      if (this.focusedComponent) {
        // assign the element before it's removed from cache
        const el = this.focusedComponent;
        el.classList.remove(EB_PREVIEW_FOCUS_CLASS);
        el.removeAttribute('name');
        el.style.removeProperty('--ebp-top');
        el.style.removeProperty('--ebp-left');
        el.style.removeProperty('--ebp-width');
        el.style.removeProperty('--ebp-height');
      }
    } else {
      const { position } = getComputedStyle(element);
      if (position === 'sticky') {
        element.classList.add('ebp-sticky');
        element.style.setProperty('--ebp-rel-top', `${top + scrollTop}px`);
        element.style.setProperty('--ebp-rel-left', `${left + scrollLeft}px`);
      }
      if (position === 'absolute') {
        element.classList.add('ebp-absolute');
      }
      element.classList.add(EB_PREVIEW_FOCUS_CLASS);
      element.setAttribute('name', interaction.component.name);
    }
  }

  /**
   * @deprecated since 1.2, will be removed.
   */
  protected override $components = signal(this.components$);
}
