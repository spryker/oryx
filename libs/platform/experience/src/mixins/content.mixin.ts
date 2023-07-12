import { Type } from '@spryker-oryx/di';
import {
  asyncState,
  computed,
  elementEffect,
  I18nMixin,
  I18nMixinType,
  signal,
  Signal,
  signalAware,
  signalProperty,
  valueType,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Observable } from 'rxjs';
import { ContentComponentProperties, ContentController, DynamicVisibilityStates } from '../index';

export const visibilityAttribute = 'dynamic-visibility';

export declare class ContentMixinInterface<OptionsType, ContentType>
  implements ContentComponentProperties<OptionsType, ContentType>
{
  uid?: string;
  options?: OptionsType;
  content?: ContentType;
  protected contentController: ContentController<ContentType, OptionsType>;

  protected data: { options: OptionsType; content: ContentType };

  /**
   * @deprecated
   */
  protected options$: Observable<OptionsType>;

  /**
   * @deprecated
   */
  protected content$: Observable<ContentType>;

  /**
   * @deprecated
   */
  protected componentOptions: OptionsType;

  /**
   * @deprecated
   */
  protected componentContent: ContentType;

  protected $options: Signal<OptionsType>;
  protected $content: Signal<ContentType>;

  dynamicVisibility: string | null;
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

    protected options$ = this.contentController.getOptions();

    @asyncState()
    protected componentOptions = valueType(this.options$);

    protected content$ = this.contentController.getContent();

    @asyncState()
    protected componentContent = valueType(this.content$);

    protected $options = signal(this.contentController.getOptions(), {
      initialValue: {},
    });

    protected $content = signal(this.contentController.getContent(), {
      initialValue: {},
    });

    @signalProperty({attribute: visibilityAttribute, reflect: true}) 
    dynamicVisibility: string | null = null;

    protected $dynamicVisibilityState = signal(this.contentController.dynamicVisibilityState());

    @elementEffect()
    protected toggleVisibilityState = (): void => {
      const state = this.$dynamicVisibilityState();

      if (state === DynamicVisibilityStates.None) {
        this.dynamicVisibility = null;
      } else {
        this.dynamicVisibility = state === DynamicVisibilityStates.Visible ? 
        DynamicVisibilityStates.Visible : 
        DynamicVisibilityStates.Hidden;
      }
    }
  }
  return ContentMixinClass as unknown as Type<
    ContentMixinInterface<OptionsType, ContentType> & I18nMixinType
  > &
    T;
};
