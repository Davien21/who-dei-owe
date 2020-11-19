const express = require('express');
const winston = require('winston')
const debts = require('../routes/debts')
const auth = require('../routes/auth')
const cors = require('cors')

const error = require('../middleware/error')

module.exports = function(app) {

  app.use(express.json());
  app.use(cors())
  app.use('/api/auth', auth) // use the auth router;
  app.use('/api/debts', debts) // use the debts router;
  
  //error middleware
  app.use(error(winston));

}