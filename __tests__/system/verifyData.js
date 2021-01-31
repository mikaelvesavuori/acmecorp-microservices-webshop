const { divider } = require('./utils');

/**
 * @description Verify that all records are present in database and that they have integrity
 */
function verifyData(data, testCount, testId) {
  divider();

  // Fail on no orders
  if (!data || data === 0) throw new Error('No test orders received!');

  // Check if all items are booked
  const allItemsBooked = data.every((item) => item.status === 'DELIVERY_BOOKED');
  console.log(
    `Created ${testCount} tests and found ${data.length} tests with new assigned test ID ${testId}.`
  );
  console.log('All items booked?', allItemsBooked);
  divider();

  // Fail on inconsistent length
  if (testCount !== data.length)
    throw new Error('FAIL: "testCount" is not the same amount as the received order count!');

  // Fail on not all items in correct state
  if (!allItemsBooked) throw new Error('FAIL: All items were not in the "DELIVERY_BOOKED" state!');

  // Pass
  console.log('PASS: System test passed successfully');
  process.exit(0);
}

module.exports = { verifyData };
