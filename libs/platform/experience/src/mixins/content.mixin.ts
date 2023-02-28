import { Type } from '@spryker-oryx/di';
import { asyncState, valueType } from '@spryker-oryx/utilities';
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

  protected options$: Observable<OptionsType>;
  protected content$: Observable<ContentType>;

  protected componentOptions: OptionsType;
  protected componentContent: ContentType;
}

export const ContentMixin = <
  OptionsType,
  ContentType = unknown,
  T extends Type<LitElement> = Type<LitElement>
>(
  superClass: T
): Type<ContentMixinInterface<OptionsType, ContentType>> & T => {
  class ContentMixinClass extends superClass {
    @property() uid?: string;

    @property({ type: Object, reflect: true })
    options?: Partial<OptionsType>;

    @property({ type: Object, reflect: true })
    content?: ContentType;

    protected contentController = new ContentController(this);

    protected options$ = this.contentController.getOptions();

    @asyncState()
    protected componentOptions = valueType(this.options$) as OptionsType;

    protected content$ = this.contentController.getContent();

    @asyncState()
    protected componentContent = valueType(this.content$);
  }
  return ContentMixinClass as unknown as Type<
    ContentMixinInterface<OptionsType, ContentType>
  > &
    T;
};
