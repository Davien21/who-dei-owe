const { Debt,validateDebt } = require('../models/debt')
const _ = require('lodash')
const auth = require('../middleware/auth')
const validateBody = require('../middleware/validateBody')
const validateObjectId = require('../middleware/validateObjectId')

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.send('get debt')
})

router.get('/:id', validateObjectId, async (req, res) => {
  const debt = await Debt.findById(req.params.id).select('name day price')

	if (!debt) return res.status(404).send('Invalid Debt')

  res.send(debt)
})
 
router.post('/', [auth, validateBody(validateDebt)], async (req, res) => {
  res.send('debt')
})
 
module.exports = router;
