import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { SemanticLinkService, SemanticLinkType } from '@spryker-oryx/site';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';
import { UserService } from '../../src/services';
import { styles } from './summary.styles';

@hydratable('window:load')
export class UserSummaryComponent extends ContentMixin(LitElement) {
  static styles = styles;

  @asyncState()
  protected user = valueType(resolve(UserService).getUser());

  @asyncState()
  protected link = valueType(
    resolve(SemanticLinkService).get({ type: SemanticLinkType.Login })
  );

  protected override render(): TemplateResult | void {
    return html` <oryx-button>
      <a href=${ifDefined(this.link)}>
        <oryx-icon type="user"></oryx-icon>
        <oryx-heading tag=${HeadingTag.Subtitle} .maxLines=${1}>
          ${this.user?.firstName} ${when(!this.user, () => i18n('user.login'))}
        </oryx-heading>
      </a>
    </oryx-button>`;
  }
}
