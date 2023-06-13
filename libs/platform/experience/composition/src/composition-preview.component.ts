import { PreviewExperienceService } from '@spryker-oryx/experience';
import { computed, effect, signal } from '@spryker-oryx/utilities';
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

  // TODO: temporary solution, hiding header and footer for header or footer editing
  // The whole override may be dropped when we will have proper template extensibility mechanism

  protected routeDriven = false;

  protected $uidFromRoute = effect(() => {
    if (!this.route) {
      return;
    }

    const headerEdit$ = (this.experienceService as PreviewExperienceService)
      .headerEdit$;

    if (this.route === '/_header' || this.route === '/_footer') {
      if (!headerEdit$.getValue()) {
        this.routeDriven = true;
        headerEdit$.next(true);
      }
    } else if (headerEdit$.getValue()) {
      this.routeDriven = false;
      headerEdit$.next(false);
    }
  });

  protected override $components = computed(() => {
    if (!this.uid) {
      return [];
    }

    const headerEdit$ = (this.experienceService as PreviewExperienceService)
      .headerEdit$;

    if (!this.routeDriven && (this.uid === 'header' || this.uid === 'footer')) {
      if (headerEdit$.getValue()) {
        return [];
      }
    }

    return (
      signal(this.experienceService.getComponent({ uid: this.uid }))()
        ?.components ?? []
    );
  });
}
