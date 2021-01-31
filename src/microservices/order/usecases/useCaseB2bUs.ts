import { OrderB2B } from '../contracts/Order';

/**
 * @description B2B orders for US market
 */
export function useCaseB2bUs(order: OrderB2B) {
  /**
   * B2B customers bypass the payment step, but they do need to verify their organization number.
   */
  order.verifyOrganizationNumber();

  console.log('B2B (US) order verified!');
}
