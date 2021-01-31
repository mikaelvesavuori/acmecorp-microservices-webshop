import { gql } from 'apollo-server-lambda';

export const typeDefs = gql`
  directive @deprecated(reason: String = "No longer supported") on FIELD_DEFINITION | ENUM_VALUE

  type Query {
    getOrder(id: Int): Order

    getAllTestOrders(testId: Int): [Order]

    """
    Demo for how to deprecate something in GraphQL
    """
    getOrderLegacy: String @deprecated(reason: "Use 'getOrder'")
  }

  type Mutation {
    placeOrder(
      name: String
      email: String
      phone: String
      street: String
      city: String
      customerType: String
      market: String
      products: String
      totalPrice: Int
      orgNumber: Int
      testId: Int
    ): Order

    updateOrderStatus(id: Int, status: Status): Order

    addDeliveryDataToOrder(deliveryData: DeliveryDataInput!): String
  }

  """
  Valid stock statuses
  """
  enum Status {
    STOCKED
    DELIVERY_BOOKED
  }

  type Order {
    orderId: Int
    customerName: String
    customerEmail: String
    customerPhone: String
    customerStreet: String
    customerCity: String
    customerType: String
    customerMarket: String
    orderedProducts: String
    totalPrice: Int
    deliveryTime: String
    status: String
    orgNumber: Int
    testId: Int
    """
    Delivery date will be added in a second "Delivery" step, so it may be absent if requested before that has happened
    """
    deliveryDate: DeliveryData
  }

  type DeliveryData {
    deliveryDate: String!
  }

  input DeliveryDataInput {
    orderId: Int!
    deliveryTime: String!
  }
`;
