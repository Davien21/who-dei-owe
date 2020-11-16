const _ = require('lodash')
const { Debt } = require('../../models/debt')
const request = require('supertest');
const mongoose = require('mongoose')


describe('/api/admins', () => {
  let server = require('../../app')
  beforeEach( async () => { await Debt.deleteMany({}) })
  
  afterEach( async () => {
    await server.close(); 
    await Debt.deleteMany({})
    
  })
   
  describe('GET /', () => {

    beforeEach( async () => {
      await Debt.collection.insertMany([
        { name: "chidi", cause: "lateness", amount: 3000},
        { name: "chidi", cause: "lateness", amount: 3000}
      ])

    })

    afterEach( async () => {
      await Debt.deleteMany({})

    })
    const exec = () => {
      return request(server).get('/api/debts')
        
    }
    it(('should return 200 with all debts'), async () => {
      const res = await exec();
      
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2);

      res.body.forEach((debt) => {
        expect(debt).toHaveProperty('name', "chidi")
        expect(debt).toHaveProperty('cause', "lateness")
        expect(debt).toHaveProperty('amount', 3000)
      })
    })
  })
 
  describe('GET /:id', () => {
    let debt;
    let debtId;

    beforeEach( async () => {

      debt = new Debt({ name: 'chidi', cause: 'lateness', amount: 3000 })

      debtId = debt._id
      await debt.save()

    })
    afterEach( async () => {
      await Debt.deleteMany({})
    })
    const exec = async () => {
      return request(server).get('/api/debts/' + debtId)
    }
    
    it('should return 404 if id is invalid', async () => {
      debtId = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    })

        
    it('should return 404 if debt with given id does not exist', async () => {
      debtId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    })
    
    it('should return 200 if debt with given id exists', async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    })
    
    it('should return debt in body of the response if id is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('cause');
      expect(res.body).toHaveProperty('amount');
    })
   
  })

  describe('POST /', () => {
    let name;
    let cause;
    let amount;
    
    beforeEach( () => {
      name = 'chidi'
      cause = 'lateness'
      amount = 7500
    })

    const exec = () => {
      return request(server)
        .post('/api/debts')
        .send({ name, cause, amount})
    }

    it(('should return 400 if name is falsy'), async () => {
      name = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if cause is falsy'), async () => {
      cause = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if invalid cause is passed'), async () => {
      cause = "Inshallah";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })
    
    it(('should return 200 if inputs are valid'), async () => {
      const res = await exec();

      expect(res.status).toBe(200)
    })
    
    it(('should save debt if inputs are valid'), async () => {
      const res = await exec();

      const debtInDB = await Debt.lookup( name, cause, amount )

      expect(debtInDB).not.toBeNull()
    })
    
    it(('should return debt to body of response'), async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name')
      expect(res.body).toHaveProperty('cause')
      expect(res.body).toHaveProperty('amount')
    })
 
  })
  
  describe('PUT /:id', () => {
    let debtId;
    let newName;
    let newCause;
    let newAmount;

    beforeEach( async () => {
      // Before each test we need to create a debt and 
      // put it in the database.
      debt = new Debt({ name: 'chidi', cause: 'lateness', amount: 500 })
      await debt.save();
      
      debtId = debt._id
      newName = 'namo'
      newCause = 'lateness'
      newAmount = 50000
    })
    const exec = () => {
      return request(server)
        .put('/api/debts/' + debtId)
        .send({ name: newName, cause: newCause, amount: newAmount})
    }
 
    it(('should return 404 if id is invalid'), async () => {
      debtId = ''

      const res = await exec();

      expect(res.status).toBe(404)
    })

    it(('should return 404 if debt with given id is not found'), async () => {
      debtId = mongoose.Types.ObjectId()

      const res = await exec();

      expect(res.status).toBe(404)
    })

    it(('should return 400 if name is falsy'), async () => {
      newName = "";

      const res = await exec();

      expect(res.status).toBe(400);
    })

    it(('should return 400 if cause is falsy'), async () => {
      newCause = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if cause is not a valid cause of the week'), async () => {
      newCause = 'bad cause'
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if amount is falsy'), async () => {
      newCause = "";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it(('should return 400 if amount is not a number'), async () => {
      newAmount = "moneyNoGoFinish";
      
      const res = await exec();

      expect(res.status).toBe(400)
    })


    it(('should update debt if inputs are valid'), async () => {
      await exec();
      
      const debtInDB = await Debt.lookup(newName, newCause, newAmount)
      
      expect(debtInDB).not.toBeNull()
      expect(debtInDB).toMatchObject({
        name: newName, cause: newCause, amount: newAmount
      })
    })

    it(('should return debt after update'), async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
      expect(res.body).toHaveProperty('cause', newCause);
      expect(res.body).toHaveProperty('amount', newAmount);
    
    })
  
  })

  describe('DELETE /:id', () => {
    let debt;
    let debtId;

    beforeEach( async () => {
      // Before each test we need to create a debt and 
      // put it in the database.
      debt = new Debt({ name: 'elliot', cause: 'lateness', amount: '2000'})
      await debt.save()
      
      debtId = debt._id
    })
    
    const exec = () => {
      return request(server)
        .delete('/api/debts/' + debtId)
        .send()
    }

    it(('should return 404 if debtId is invalid'), async () => {
      debtId = "1";

      const res = await exec();

      expect(res.status).toBe(404);
    })
 
    it(('should return 404 if debt is not found'), async () => {
      debtId = mongoose.Types.ObjectId();

      const res = await exec();
      
      expect(res.status).toBe(404);
    })
    
    it(('should return 200 if inputs are valid'), async () => {
      const res = await exec();

      expect(res.status).toBe(200)
    })
    
    it(('should delete debt if debt exists is valid'), async () => {
      const res = await exec();

      const debtInDB = await Debt.findById(debtId)

      expect(debtInDB).toBeNull()
    })

    it(('should return deleted debt to body of response'), async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('name')
      expect(res.body).toHaveProperty('cause')
      expect(res.body).toHaveProperty('amount')
    })
 
  })
  

})