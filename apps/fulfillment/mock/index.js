require('dotenv').config();
const { createMockServer } = require('./server');

const port = process.env.MOCK_PORT_PA || 3001;

createMockServer().listen(port, function () {
  console.log(`JSON Server is running on ${port}`);
});
