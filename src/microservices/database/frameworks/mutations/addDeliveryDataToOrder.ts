import { makeNewOrderDatabase } from '../../entities/OrderDatabase';

export const addDeliveryDataToOrder = async (id: number, deliveryTime: string) => {
  const db = makeNewOrderDatabase();
  return await db.addDeliveryDataToOrder(id, deliveryTime);
};
