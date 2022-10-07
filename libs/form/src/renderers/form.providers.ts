import { DefaultFormRenderer } from './default-form.renderer';
import { FormRenderer } from './form.renderer';

export const formProviders = [
  {
    provide: FormRenderer,
    useClass: DefaultFormRenderer,
  },
];
