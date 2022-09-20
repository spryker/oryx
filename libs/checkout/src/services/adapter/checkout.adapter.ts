import { Observable } from 'rxjs';
import { ApiCheckoutModel, CheckoutData } from '../../models';

export interface GetCheckoutDataProps {
  idCart: string;
  include?: ApiCheckoutModel.Includes[];
}

export interface UpdateCheckoutDataProps {
  idCart: string;
  include?: ApiCheckoutModel.Includes[];
  attributes: CheckoutData;
}

export interface CheckoutAdapter {
  get: (data: GetCheckoutDataProps) => Observable<CheckoutData>;
  update: (data: UpdateCheckoutDataProps) => Observable<CheckoutData>;
}

export const CheckoutAdapter = 'FES.CheckoutAdapter';

declare global {
  interface InjectionTokensContractMap {
    [CheckoutAdapter]: CheckoutAdapter;
  }
}
