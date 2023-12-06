import {
  EVENT_TOGGLE_COLOR,
  toggleMode,
} from '@spryker-oryx/ui/color-mode-selector';
import { Observable, tap } from 'rxjs';
import { MessageType } from '../../data-client.model';
import { ExperienceDataRevealer } from '../../data-client.service';
import { catchMessage } from '../../utilities';

export class ColorModeExperienceDataRevealer implements ExperienceDataRevealer {
  protected colorMode$ = catchMessage(MessageType.ColorMode).pipe(
    tap((mode) => {
      toggleMode(mode);
      window.dispatchEvent(
        new CustomEvent(EVENT_TOGGLE_COLOR, {
          bubbles: true,
          composed: true,
          detail: mode,
        })
      );
    })
  );

  reveal(): Observable<unknown> {
    return this.colorMode$;
  }
}
