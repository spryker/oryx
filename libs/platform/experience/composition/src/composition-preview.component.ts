import { Component, PreviewExperienceService } from '@spryker-oryx/experience';
import {
  effect,
  elementEffect,
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
import {
  compositionPreviewStyles,
  compositionStyles,
} from './composition.styles';

const EB_PREVIEW_FOCUS_CLASS = 'eb-preview-focus';

export class CompositionPreviewComponent extends CompositionComponent {
  static styles = [compositionStyles, compositionPreviewStyles];

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
    const targetComponent = this.shadowRoot?.querySelector(
      ` [uid='${interaction.component.id}']`
    );

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
  });

  // TODO: temporary solution, hiding header and footer for header or footer editing
  // The whole override may be dropped when we will have proper template extensibility mechanism
  @observe()
  protected uid$ = new BehaviorSubject<string | undefined>(this.uid);

  @observe()
  protected route$ = new BehaviorSubject<string | undefined>(this.route);

  protected routeDriven = false;

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

  protected components$ = this.uid$.pipe(
    switchMap((uid) => {
      const headerEdit$ = (this.experienceService as PreviewExperienceService)
        .headerEdit$;

      const component = this.experienceService
        .getComponent({ uid })
        .pipe(catchError(() => of({} as Component)));

      if (!this.routeDriven && (uid === 'header' || uid === 'footer')) {
        return component.pipe(
          switchMap((component) =>
            headerEdit$.pipe(
              map((edit) => (edit ? ({} as Component) : component))
            )
          )
        );
      }
      return component;
    }),
    map((component: Component) => component?.components ?? [])
  );

  protected override $components = signal(this.components$);
}
