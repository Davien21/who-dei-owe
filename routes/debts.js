const { Debt, validateDebt } = require('../models/debt')
const _ = require('lodash')

const validateBody = require('../middleware/validateBody')
const validateObjectId = require('../middleware/validateObjectId')

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const debts = await Debt.find()

  res.send(debts)
})

router.get('/:id', validateObjectId, async (req, res) => {
  const debt = await Debt.findById(req.params.id).select('name cause amount')

	if (!debt) return res.status(404).send('Invalid Debt')

  res.send(debt)
})
 
router.post('/', [validateBody(validateDebt)], async (req, res) => {
  let debt = new Debt( _.pick(req.body, ['name', 'cause', 'amount'] ))
  
  debt = await debt.save()

  res.send(debt)
})

router.put('/:id', [ validateObjectId, validateBody(validateDebt)], async (req, res) => {
  const debt = await Debt.findByIdAndUpdate(req.params.id,
    _.pick(req.body, ['name', 'cause', 'amount']), { new: true })

  if(!debt) return res.status(404).send('Invalid Debt')

  res.send(debt);
})

router.delete('/:id', [ validateObjectId], async (req, res) => {
  const debt = await Debt.findByIdAndDelete(req.params.id)

  if(!debt) return res.status(404).send('Invalid Debt')

  res.send(debt);
})
 
module.exports = router;
