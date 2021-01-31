import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';

import { Params } from '../contracts/Params';

const DATABASE_REGION = process.env.DATABASE_REGION;
const DB_NAME = process.env.DB_NAME;
const TABLE_NAME = process.env.TABLE_NAME;
const SECRET_ARN = process.env.SECRET_ARN;
const CLUSTER_ARN = process.env.CLUSTER_ARN;
if (!DATABASE_REGION || !DB_NAME || !TABLE_NAME || !SECRET_ARN || !CLUSTER_ARN)
  throw new Error('Missing required environment variables!');

const client = new RDSDataClient({ region: process.env.DATABASE_REGION });

/**
 * @description Basic factory function to create the OrderDatabase entity/instance
 */
export const makeNewOrderDatabase = () => new OrderDatabase();

/**
 * @description The OrderDatabase is the entity that handles any order operations like creating or updating them.
 *
 * @see https://docs.aws.amazon.com/rdsdataservice/latest/APIReference/API_Operations.html
 * @see https://www.npmjs.com/package/@aws-sdk/client-rds-data
 */
class OrderDatabase {
  constructor() {
    if (!DB_NAME || !TABLE_NAME || !SECRET_ARN || !CLUSTER_ARN)
      this.throwError('Missing required environment variables!');
  }

  /**
   * @description Create AWS RDS parameters
   */
  private createParams(query: string): Params {
    return {
      secretArn: SECRET_ARN,
      resourceArn: CLUSTER_ARN,
      sql: query,
      database: DB_NAME,
      includeResultMetadata: true
    };
  }

  /**
   * @description Call the RDS instance using provided parameters
   */
  private async callDb(params: Params): Promise<any> {
    const command = new ExecuteStatementCommand(params);
    try {
      const data = await client.send(command);

      if (!data || !data.records) return data;
      let rows = [];
      let cols = [];

      data.columnMetadata.map((v, i) => cols.push(v.name));

      if (data.records.length > 0) {
        data.records.map((r) => {
          let row = {};
          r.map((v, i) => (row[cols[i]] = Object.values(v)[0]));
          rows.push(row);
        });
      }

      // Lower-case all rows
      rows.forEach((row) => {
        Object.keys(row).forEach((r) => {
          const lowerCaseRow = r.charAt(0).toLowerCase() + r.slice(1);
          row[lowerCaseRow] = row[r];
          delete row[r];
        });
      });

      return rows;
    } catch (error) {
      this.throwError(error);
    }
  }

  /**
   * @description Helper to throw and log errors
   */
  private throwError(message: string) {
    console.error(message);
    throw new Error(message);
  }

  /**
   * @description Operation to place a complete order
   */
  public async placeOrder(
    name: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    customerType: string,
    market: string,
    products: string,
    totalPrice: number,
    orgNumber: number,
    testId: number
  ): Promise<any> {
    const id = Math.round(Math.random() * 10000000);
    console.log(`Adding order "${id}" to the database...`);

    const response = await this.callDb(
      this.createParams(
        queries.placeOrder(
          id,
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
        )
      )
    );

    console.log(`Added order "${id}" to the database`);

    return { orderId: id, products, name, email, totalPrice };
  }

  /**
   * @description Operation to update an order's status
   */
  public async updateOrderStatus(id: number, status: string): Promise<any> {
    console.log(`Updating order "${id}" with status "${status}..."`);

    await this.callDb(this.createParams(queries.updateStatus(id, status)));

    console.log(`Updated order "${id}" with status "${status}"; Ready to deliver!`);

    const order = await this.getOrder(id);

    return {
      orderId: id,
      name: order[0].customerName,
      email: order[0].customerEmail,
      phone: order[0].customerPhone,
      city: order[0].customerCity,
      street: order[0].customerStreet
    };
  }

  /**
   * @description Operation to get an individual order
   */
  public async getOrder(id: number): Promise<any> {
    console.log(`Getting order "${id}"..."`);

    const response = await this.callDb(this.createParams(queries.getOrder(id)));

    return response;
  }

  /**
   * @description Operation to get all test orders by test ID
   */
  public async getAllTestOrders(testId: number): Promise<any> {
    console.log(`Getting test orders with test ID "${testId}"..."`);

    const response = await this.callDb(this.createParams(queries.getAllTestOrders(testId)));

    return response;
  }

  /**
   * @description Operation to add delivery data to an order
   */
  public async addDeliveryDataToOrder(id: number, deliveryTime: string): Promise<any> {
    console.log(`Adding delivery data to order "${id}"`);

    const response = await this.callDb(
      this.createParams(queries.addDeliveryDate(id, deliveryTime))
    );

    return response;
  }
}

/**
 * @description Helper to create SQL queries
 */
const queries = {
  placeOrder: (
    id: number,
    name: string,
    email: string,
    phone: string,
    street: string,
    city: string,
    type: string,
    market: string,
    products: string,
    totalPrice: number,
    orgNumber: number,
    testId: number
  ) =>
    `INSERT IGNORE INTO Orders (OrderId, CustomerName, CustomerEmail, CustomerPhone, CustomerStreet, CustomerCity, CustomerType, CustomerMarket, OrderedProducts, TotalPrice, Status, OrgNumber, TestId) VALUES (${id}, "${name}", "${email}", "${phone}", "${street}", "${city}", "${type}", "${market}", "${products}", "${totalPrice}", "PLACED", "${orgNumber}", "${testId}");`,
  getOrder: (id: number) => `SELECT * FROM Orders WHERE OrderId = ${id};`,
  getAllTestOrders: (testId: number) => `SELECT * FROM Orders WHERE TestId = ${testId}`,
  updateStatus: (id: number, status: string) =>
    `UPDATE ${TABLE_NAME} SET STATUS = "${status}" WHERE OrderId = ${id};`,
  addDeliveryDate: (id: number, deliveryTime: string) =>
    `UPDATE ${TABLE_NAME} SET DeliveryTime = "${deliveryTime}" WHERE OrderId = ${id};`
};
