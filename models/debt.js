const Joi = require('joi');
const mongoose = require('mongoose');
let model = {};
model.debtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength : 3, 
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

model.debtSchema.statics.lookup = function(name, cause, amount) {
  return this.findOne({
    "name": name, "cause": cause, "amount": amount
  })
}

model.Debt = mongoose.model('Debt', model.debtSchema)

model.validateDebt = (debt) => {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    cause: Joi.string()
    .valid(
      'lateness'
    ).required().insensitive(),
    amount: Joi.number().required()
  }
	return result = Joi.validate(debt, schema);
} 

module.exports = model;

