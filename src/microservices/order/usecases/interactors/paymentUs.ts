import { Order } from '../../contracts/Order';

/**
 * @description Here is where you would import and/or call any payment provider services and conduct the actual transaction with them
 */
export function paymentUs(order: Order) {
  const amount = order.getLocalPrice();

  // Do whatever you need to integrate with the service...
  // const paymentProvider = new PopularPaymentProviderInUsa();
  // paymentProvider.pay(amount);

  console.log(`Paid ${amount} to "Blank of America"!`);
}
