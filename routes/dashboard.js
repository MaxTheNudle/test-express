const express = require('express');
const router = express.Router();
const { CustomerModel, ProductModel, CollentionOrderModel, IncomeAndExpensesModel } = require('../DB/Model');


router.get('/', async (req, res) => {
    res.send('Welcome to Dashboard');
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await CustomerModel.findById(id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const AllIncomeAndExpenses = await IncomeAndExpensesModel.find({ customer_id: id });

        if (AllIncomeAndExpenses.length === 0) {
            return res.status(404).json({ message: 'Income and Expenses not found' });
        }


        let currentYear = new Date().getFullYear();

        let IncomeInYear =
            AllIncomeAndExpenses
                .filter((item) => new Date(item.createdAt).getFullYear() === currentYear && item.type === 'Income')
                .reduce((acc, item) => acc + item.price, 0);

        let ExpensesInYear =
            AllIncomeAndExpenses
                .filter((item) => new Date(item.createdAt).getFullYear() === currentYear && item.type === 'Expenses')
                .reduce((acc, item) => acc + item.price, 0);

        let previousYear = currentYear - 1;
        let IncomeInPreviousYear =
            AllIncomeAndExpenses
                .filter((item) => new Date(item.createdAt).getFullYear() === previousYear && item.type === 'Income')
                .reduce((acc, item) => acc + item.price, 0);
        let ExpensesInPreviousYear =
            AllIncomeAndExpenses
                .filter((item) => new Date(item.createdAt).getFullYear() === previousYear && item.type === 'Expenses')
                .reduce((acc, item) => acc + item.price, 0);
        
        // show growth rate by this year with previous Year as percentage 
        let IncomegrowthRate = 0;
        if (IncomeInPreviousYear !== 0) {
            IncomegrowthRate = ((IncomeInYear - IncomeInPreviousYear) / IncomeInPreviousYear) * 100;
        }
        let ExpensesgrowthRate = 0;
        if (ExpensesInPreviousYear !== 0) {
            ExpensesgrowthRate = ((ExpensesInYear - ExpensesInPreviousYear) / ExpensesInPreviousYear) * 100;
        }

        let month = [];
        for (let i = 0; i < 12; i++) {
            month.push({ mouth: i, income: 0, expenses: 0 });
        }
        AllIncomeAndExpenses.forEach((item) => {
            const itemYear = new Date(item.createdAt).getFullYear();
            const itemMonth = new Date(item.createdAt).getMonth(); // 0-11

            if (itemYear === currentYear) {
                if (item.type === 'Income') {
                    month[itemMonth].income += item.price;
                } else if (item.type === 'Expenses') {
                    month[itemMonth].expenses += item.price;
                }
            }
        });

        res.status(200).json({
            month,
            IncomeInYear,
            ExpensesInYear,
            IncomeInPreviousYear,
            ExpensesInPreviousYear,
            IncomegrowthRate,
            ExpensesgrowthRate
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
