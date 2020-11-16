const { Debt, validateDebt } = require('../../../models/debt')
const mongoose = require('mongoose')
describe('validateDebt function', () => {
  it('should return an object with error and value properties', () => {
    const debt = { name: "chidi"}

    const joiObject = validateDebt(debt)

    expect(joiObject).toHaveProperty('error')
    expect(joiObject).toHaveProperty('value')
  })
  
})

describe('Debt model', () => {
  
  describe(" 'cause' path", () => {
    it('should throw an error for invalid cause input', async () => {
      try {
        debtInput = { name: "chidi", cause: "", amount: 1000}
        
        const debt = new Debt(debtInput)
        
        await debt.save()
        
      } catch (ex) {
        expect(ex.errors.cause).toBeDefined()
      }
    })

  })

})