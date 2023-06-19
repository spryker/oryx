require('dotenv').config();
const { createMockServer } = require('./server');

const port = process.env.ORYX_FULFILLMENT_MOCK_PORT || 3001;

createMockServer().listen(port, function () {
  console.log(`JSON Server is running on ${port}`);
});
