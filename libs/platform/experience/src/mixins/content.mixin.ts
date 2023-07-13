import { Type } from '@spryker-oryx/di';
import {
  elementEffect,
  I18nMixin,
  I18nMixinType,
  signal,
  Signal,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { isServer, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ContentComponentProperties, ContentController } from '../index';
import { visibilityAttribute } from '@spryker-oryx/core';

export declare class ContentMixinInterface<OptionsType, ContentType>
  implements ContentComponentProperties<OptionsType, ContentType>
{
  uid?: string;
  options?: OptionsType;
  content?: ContentType;
  protected contentController: ContentController<ContentType, OptionsType>;
  protected $options: Signal<OptionsType>;
  protected $content: Signal<ContentType>;
}

export const ContentMixin = <
  OptionsType,
  ContentType = unknown,
  T extends Type<LitElement> = Type<LitElement>
>(
  superClass: T
): Type<ContentMixinInterface<OptionsType, ContentType> & I18nMixinType> &
  T => {
  @signalAware()
  class ContentMixinClass extends I18nMixin(superClass) {
    @property() uid?: string;

    @property({ type: Object, reflect: true })
    options?: Partial<OptionsType>;

    @property({ type: Object, reflect: true })
    content?: ContentType;

    protected contentController = new ContentController(this);

    protected $options = signal(this.contentController.getOptions(), {
      initialValue: {},
    });

    protected $content = signal(this.contentController.getContent(), {
      initialValue: {},
    });

    @signalProperty({ attribute: visibilityAttribute, reflect: true })
    _dynamicVisibility: string | null = null;

    // protected $visibility = signal(
    //   this.contentController.dynamicVisibilityState()
    // );

    // @elementEffect()
    // protected toggleVisibilityState = (): void => {
    //   if (!this.uid) return;

    //   const visibility = this.$visibility();

    //   if (visibility === DynamicVisibilityStates.None) {
    //     this._dynamicVisibility = null;
    //   } else {
    //     this._dynamicVisibility =
    //       !isServer && visibility === DynamicVisibilityStates.Visible
    //         ? DynamicVisibilityStates.Visible
    //         : DynamicVisibilityStates.Hidden;
    //   }
    // };
  }
  return ContentMixinClass as unknown as Type<
    ContentMixinInterface<OptionsType, ContentType> & I18nMixinType
  > &
    T;
};
