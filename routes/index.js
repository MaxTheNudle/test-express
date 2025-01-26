var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const {CustomerModel , } = require('../DB/Model'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// loging 
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await CustomerModel
      .findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});








module.exports = router;
