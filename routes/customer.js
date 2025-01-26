



const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {CustomerModel , IncomeAndExpensesModel} = require('../DB/Model'); 

router.get('/:id', async (req, res) => {
  try {
    const customer = await CustomerModel.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.post('/add', async (req, res) => {
  try {
    const { name, email, password, phone, rate_discount } = req.body;

    const existingCustomer = await CustomerModel.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new CustomerModel({
      name,
      email,
      password: hashedPassword,
      phone,
      rate_discount,
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.put('/edit/:id', async (req, res) => {
  try {
    const { name, email, phone, rate_discount , wallet } = req.body;

    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, rate_discount , wallet },
      { new: true, runValidators: true } 
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedCustomer = await CustomerModel.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// change password
router.put('/changePassword/:id', async (req, res) => {
  try {
    const { newPassword } = req.body;
    console.log("newPassword",newPassword);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/topup/:id', async (req, res) => {
  try {
    const { wallet_topup  } = req.body;
    
    if (!wallet_topup) {
      return res.status(400).json({ message: 'Wallet topup is required' });
    }

    const customer = await CustomerModel.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    let walletUpdate = customer.wallet + wallet_topup;
    // fixed 2 decimal
    walletUpdate = walletUpdate.toFixed(2);
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      req.params.id,
      { wallet: walletUpdate },
      { new: true, runValidators: true }
    );
    // save to income and expenses
    const newIncomeAndExpenses = new IncomeAndExpensesModel({
      customer_id: req.params.id,
      label: 'Topup',
      type: 'Income',
      price: wallet_topup,
    });
    newIncomeAndExpenses.save();

    res.status(200).json(updatedCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
