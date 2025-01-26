
const express = require('express');
const router = express.Router();
const { CustomerModel, ProductModel  , CollentionOrderModel , IncomeAndExpensesModel } = require('../DB/Model');

//get all income and expenses by customer id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id; 
        let { createdAt, type } = req.query; 
        const filterObject = { customer_id: id };   
        

        if (createdAt) {
            // format to date string
            createdAt = new Date(createdAt);
            filterObject.createdAt = { $gte: createdAt, $lt: new Date(createdAt.getTime() + 86400000) }; // 24 hours
        }

        if (type) {
            filterObject.type = type;
        }
        console.log(filterObject);
        const incomeAndExpenses = await IncomeAndExpensesModel.find(filterObject);

        if (incomeAndExpenses.length === 0) {
            return res.status(404).json({ message: 'Income and Expenses not found' });
        }
        const customer = await CustomerModel.findById(id);
        res.status(200).json({
            incomeAndExpenses,
            currentBalance: customer.wallet
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
