const express = require('express');

const app = express();
const PORT = 3000;

const apiRoutes = require('./routes/api');

app.use(express.json());
app.use('/', apiRoutes);

console.log("API server has started");
app.listen(PORT);