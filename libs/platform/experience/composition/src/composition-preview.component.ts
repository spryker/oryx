import { PreviewExperienceService } from '@spryker-oryx/experience';
import { effect, signal } from '@spryker-oryx/utilities';
import { previewStyles } from './composition-preview.styles';
import { CompositionComponent } from './composition.component';

const EB_PREVIEW_FOCUS_CLASS = 'eb-preview-focus';

export class CompositionPreviewComponent extends CompositionComponent {
  static styles = [previewStyles];

  protected $interaction = signal(
    (this.experienceService as PreviewExperienceService)?.getInteractionData()
  );

  protected $selectedComponent = effect(() => {
    const actions = ['mouseover', 'click', 'mouseout', 'add'];
    const interaction = this.$interaction();

    if (!actions.includes(interaction?.action)) {
      return;
    }

    const focusedNameAttr = 'name';
    const root = this.shadowRoot;
    const focusedComponent = root?.querySelector(`.${EB_PREVIEW_FOCUS_CLASS}`);
    const targetComponent = root?.querySelector(
      ` [uid='${interaction.component.id}']`
    );

    if (
      targetComponent &&
      getComputedStyle(targetComponent).display === 'inline'
    ) {
      (targetComponent as HTMLElement)?.style.setProperty('display', 'block');
    }

    focusedComponent?.classList.remove(EB_PREVIEW_FOCUS_CLASS);
    focusedComponent?.removeAttribute(focusedNameAttr);
    (focusedComponent as HTMLElement)?.style.removeProperty('display');

    if (interaction.action !== 'mouseout') {
      targetComponent?.classList.add(EB_PREVIEW_FOCUS_CLASS);
      targetComponent?.setAttribute(
        focusedNameAttr,
        interaction.component.name
      );
    }
  });

  protected override components$ = combineLatest([this.uid$, this.route$]).pipe(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tap(([uid, route]) => {
      const headerEdit$ = (this.experienceService as PreviewExperienceService)
        .headerEdit$;

      if (route) {
        if (route === '/_header' || route === '/_footer') {
          if (!headerEdit$.value) {
            headerEdit$.next(true);
          }
        } else if (headerEdit$.value) {
          headerEdit$.next(false);
        }
      }
    }),
    switchMap(([uid, route]) => {
      const headerEdit$ = (this.experienceService as PreviewExperienceService)
        .headerEdit$;

      const component =
        this.experienceService?.getComponent({ uid, route }) ||
        of({} as Component);
      if (uid === 'header' || uid === 'footer') {
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
    tap((component) => {
      this.uid = component?.id;
    }),
    map((component: Component) => component?.components ?? [])
  );
}
