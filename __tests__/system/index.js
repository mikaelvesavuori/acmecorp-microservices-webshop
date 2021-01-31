const { verifyData } = require('./verifyData');
const { queryGetOrders } = require('./query');
const { createOptions, callService, createOrder, sleep, generateTestId } = require('./utils');
const { config } = require('./config');

// ID for this specific test run
const TEST_ID = generateTestId();

// Time to wait until first verification
const WAIT_TIME = 5000;

// Time to wait until running next iteration in call-loop
const LOOP_WAIT_TIME = 300;

// Endpoint environment
const ENV = 'dev';

/**
 * @description Run a full system test, starting with a number of test orders and verify presence in order database at the end.
 */
async function SystemTestController(testCount = 1, customerData = {}) {
  console.log('Generated test ID is', TEST_ID, '\n');

  try {
    /**
     * Get endpoints for our environment
     */
    const { createOrderServiceEndpoint, databaseServiceEndpoint } =
      ENV === 'dev' ? config.endpoints.dev : config.endpoints.prod;

    /**
     * Loop-call service
     */
    for (let i = 1; i <= testCount; i++) {
      const order = createOrder({ ...customerData, testId: TEST_ID });
      const resp = await callService(createOrderServiceEndpoint, createOptions('POST', order));
      await sleep(LOOP_WAIT_TIME);
      console.log(i, order, resp, '\n');
    }

    /**
     * Wait for events to have settled
     */
    await sleep(WAIT_TIME);

    /**
     * Get data
     * NOTE: This approach will depend on you "auto-booking" delivery times. This is on by default (see `serverless.yml`).
     * If you are not, before hitting the below endpoint, you'll need to call the "Book delivery" endpoint to place the order in the correct status.
     */
    const dbData = await callService(
      databaseServiceEndpoint,
      createOptions('POST', queryGetOrders(TEST_ID))
    );

    /**
     * Verify
     */
    verifyData(dbData.data.getAllTestOrders, testCount, TEST_ID);
  } catch (error) {
    throw new Error(error);
  }
}

// Run tests
SystemTestController(100, {
  customerType: 'B2C',
  market: 'US'
});
