import { Type } from '@spryker-oryx/di';
import {
  asyncState,
  elementEffect,
  I18nMixin,
  I18nMixinType,
  signal,
  Signal,
  signalAware,
  valueType,
} from '@spryker-oryx/utilities';
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { Observable } from 'rxjs';
import { ContentComponentProperties, ContentController } from '../index';

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

  protected $isHidden: Signal<boolean>;
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

    protected $isHidden = signal(this.contentController.isHidden());
  }
  return ContentMixinClass as unknown as Type<
    ContentMixinInterface<OptionsType, ContentType> & I18nMixinType
  > &
    T;
};
