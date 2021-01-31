import { OrderB2C } from '../contracts/Order';

import { paymentUs } from './interactors/paymentUs';

/**
 * @description B2C orders for US market
 */
export function useCaseB2cUs(order: OrderB2C) {
  /**
   * Integration with Payment Provider.
   * B2C customers pay upfront while B2B customers bypass the payment step.
   */
  paymentUs(order);
}
