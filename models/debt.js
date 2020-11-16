const Joi = require('joi');
const mongoose = require('mongoose');
let model = {};
model.debtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength : 5, 
    maxlength : 50,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  cause: {
    type: String,
    enum: [
      'lateness'
    ],
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
})

model.Debt = mongoose.model('Debt', model.debtSchema)

model.validateDebt = (debt) => {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    cause: Joi.string()
    .valid(
      'lateness'
    ).required().insensitive(),
    price: Joi.number().required()
  }
	return result = Joi.validate(debt,schema);
} 

module.exports = model;

