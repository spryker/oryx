import { PreviewExperienceService } from '@spryker-oryx/experience';
import { effect, elementEffect, signal } from '@spryker-oryx/utilities';
import { query } from 'lit/decorators.js';
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
}
