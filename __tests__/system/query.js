/**
 * @description GraphQL query for getting test orders
 */
const queryGetOrders = (testId) => {
  return {
    query: `query {
      getAllTestOrders(testId: ${testId}) {
        customerName
        customerEmail
        customerPhone
        customerStreet
        customerCity
        customerType
        customerMarket
        orderedProducts
        totalPrice
        deliveryTime
        status
        testId
        orgNumber
      }
    }
    `
  };
};

module.exports = { queryGetOrders };
