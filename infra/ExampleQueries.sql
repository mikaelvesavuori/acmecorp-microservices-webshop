# Insert single row
USE microservicesdemo; INSERT IGNORE INTO Orders (OrderId, CustomerName, CustomerEmail, CustomerPhone, CustomerStreet, CustomerCity, CustomerType, CustomerMarket, OrderedProducts, Status) VALUES (1234, "name", "email", "phone", "street", "city", "type", "market", "products", "PLACED");

# Update single row
USE microservicesdemo; UPDATE Orders SET DeliveryTime = "1600000000000" WHERE OrderId = 123;

# Get single row by order ID
USE microservicesdemo; SELECT * FROM Orders WHERE OrderId = 123;

# Get all unique order IDs
USE microservicesdemo; SELECT DISTINCT OrderId FROM Orders;

# Get all rows
USE microservicesdemo; SELECT * FROM Orders;

# Delete single row by order ID
USE microservicesdemo; DELETE FROM Orders WHERE OrderId = 123;

# Delete all rows
USE microservicesdemo; TRUNCATE TABLE Orders;

# Create order table
USE microservicesdemo; CREATE TABLE Orders( OrderId int NOT NULL, CustomerName VARCHAR(50), CustomerEmail VARCHAR(50), CustomerPhone VARCHAR(30), CustomerStreet VARCHAR(50), CustomerCity VARCHAR(30), CustomerType CHAR(3), CustomerMarket CHAR(2), OrderedProducts VARCHAR(200), TotalPrice int, DeliveryTime VARCHAR(13), Status VARCHAR(16), OrgNumber VARCHAR(20), TestId int, UNIQUE (OrderId) );

# Drop/delete table
USE microservicesdemo; DROP TABLE Orders;

# Show tables
USE microservicesdemo; SHOW TABLES from microservicesdemo;