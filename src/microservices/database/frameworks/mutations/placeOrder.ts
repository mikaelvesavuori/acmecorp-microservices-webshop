import { makeNewOrderDatabase } from '../../entities/OrderDatabase';

import { emitEvent } from '../../../../common/EmitEvent/EmitEvent';

export const placeOrder = async (
  name: string,
  email: string,
  phone: string,
  street: string,
  city: string,
  customerType: string,
  market: string,
  products: string,
  totalPrice: number,
  orgNumber?: number,
  testId?: number
) => {
  const db = makeNewOrderDatabase();

  const data = await db.placeOrder(
    name,
    email,
    phone,
    street,
    city,
    customerType,
    market,
    products,
    totalPrice,
    orgNumber,
    testId
  );

  await emitEvent('OrderPlaced', data);

  return data.orderId;
};
