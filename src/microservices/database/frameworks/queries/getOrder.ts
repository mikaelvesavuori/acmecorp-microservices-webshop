import { makeNewOrderDatabase } from '../../entities/OrderDatabase';

export const getOrder = async (id: number) => {
  const db = makeNewOrderDatabase();
  const [data] = await db.getOrder(id);
  return data;
};
