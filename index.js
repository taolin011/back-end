const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(8080, () => {
  console.log('Express 服务已启动');
});
