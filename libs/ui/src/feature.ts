import { AppFeature } from '@spryker-oryx/core';
import { buttonComponent } from '../actions/button/src/component';
import { iconButtonComponent } from '../actions/icon-button/src/component';
import { linkComponent } from '../actions/link/src/component';
import { toggleIconComponent } from '../actions/toggle-icon/src/component';
import { toggleComponent } from '../actions/toggle/src/component';
import { cardComponent } from '../card/src/component';
import { collapsibleComponent } from '../collapsible/src/collapsible.def';
import { errorMessageComponent } from '../error-message/src/component';
import { checkboxComponent } from '../form/checkbox/src/component';
import { inputListComponent } from '../form/input-list/src/component';
import { inputComponent } from '../form/input/src/component';
import { passwordInputComponent } from '../form/password/src/component';
import { radioComponent } from '../form/radio/src/component';
import { selectComponent } from '../form/select/src/component';
import { tagComponent } from '../form/tag/src/component';
import { chipComponent } from '../graphical/chip/src/chip.def';
import { iconComponent } from '../graphical/icon/src/component';
import { ratingComponent } from '../graphical/rating/src/component';
import { spinnerComponent } from '../graphical/spinner/src/component';
import { navigationItemComponent } from '../navigations/navigation-item/src/component';
import { navigationComponent } from '../navigations/navigation/src/component';
import { pageNavigationItemComponent } from '../navigations/page-navigation-item/src/component';
import { pageNavigationComponent } from '../navigations/page-navigation/src/component';
import { paginationComponent } from '../navigations/pagination/src/component';
import { tabComponent } from '../navigations/tab/src/tab.def';
import { tabsComponent } from '../navigations/tabs/src/tabs.def';
import { optionComponent } from '../option/src/component';
import { drawerComponent } from '../overlays/drawer/src/component';
import { dropdownComponent } from '../overlays/dropdown/src/component';
import { modalComponent } from '../overlays/modal/src/component';
import { notificationCenterComponent } from '../overlays/notification-center/src/component';
import { notificationComponent } from '../overlays/notification/src/component';
import { popoverComponent } from '../overlays/popover/src/component';
import { searchboxComponent } from '../search/searchbox/src/component';
import { typeheadComponent } from '../search/typeahead/src/component';
import { headlineComponent } from '../structure/headline/src/component';
import { textComponent } from '../structure/text/src/component';
import { tileComponent } from '../structure/tile/src/component';

export const uiFeature: AppFeature = {
  components: [
    buttonComponent({
      theme: () =>
        import('../actions/button/src/styles/themes/storefront.styles').then(
          (b) => b.theme
        ),
    }),
    cardComponent,
    checkboxComponent,
    chipComponent,
    collapsibleComponent,
    drawerComponent,
    dropdownComponent,
    errorMessageComponent,
    headlineComponent,
    iconButtonComponent,
    iconComponent,
    inputComponent,
    inputListComponent,
    linkComponent,
    modalComponent,
    navigationComponent,
    navigationItemComponent,
    notificationCenterComponent,
    notificationComponent,
    optionComponent,
    pageNavigationComponent,
    pageNavigationItemComponent,
    paginationComponent,
    passwordInputComponent,
    popoverComponent,
    radioComponent,
    ratingComponent,
    searchboxComponent,
    selectComponent,
    spinnerComponent,
    tabComponent,
    tabsComponent,
    tagComponent,
    textComponent,
    tileComponent,
    toggleComponent,
    toggleIconComponent,
    typeheadComponent,
  ],
};
