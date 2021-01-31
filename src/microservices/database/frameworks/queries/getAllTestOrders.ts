import { makeNewOrderDatabase } from '../../entities/OrderDatabase';

export const getAllTestOrders = async (testId: number) => {
  const db = makeNewOrderDatabase();
  return await db.getAllTestOrders(testId);
};
