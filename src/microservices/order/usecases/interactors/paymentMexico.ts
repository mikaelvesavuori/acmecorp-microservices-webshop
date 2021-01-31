import { Order } from '../../contracts/Order';

/**
 * @description Here is where you would import and/or call any payment provider services and conduct the actual transaction with them
 */
export function paymentMexico(order: Order) {
  const amount = order.getLocalPrice();

  // Do whatever you need to integrate with the service...
  // const paymentProvider = new PopularPaymentProviderInMexico();
  // paymentProvider.pay(amount);

  console.log(`Paid ${amount} to "El Banco Blanco"!`);
}
