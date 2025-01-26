



const express = require('express');
const router = express.Router();
const { CustomerModel, ProductModel  , CollentionOrderModel , IncomeAndExpensesModel } = require('../DB/Model');

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id ;
        const Product = await ProductModel.findById(id);
        if (!Product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(Product); // Return the Product details
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/add', async (req, res) => {
    try {
        const { name, price } = req.body;

        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product already exists' });
        }


        const newProduct = new ProductModel({
            name,
            price
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/edit/', async (req, res) => {
    try {
        const { name, price } = req.body;

        const updatedProduct = await ProductModel.findOneAndUpdate(
            { name },
            { name, price },
            { new: true, runValidators: true }
        );
        // update

        updatedProduct

        if (!updatedProduct) {
            return res.status(404).json({ message: ' Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// purchase product

router.post('/purchase', async (req, res) => {
    try {
        const { CustomerId, productName } = req.body;

        // Find the user by userId
        const customer = await CustomerModel.findById(CustomerId);
        if (!customer) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the product by name
        const product = await ProductModel.findOne({ name: productName });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate the discount price if the user has a rate_discount
        let discount = customer.rate_discount || 0; // Default to 0 if no discount
        discount = (product.price * discount) / 100
        const finalPrice = (product.price - discount).toFixed(2);

        // Check if the user has enough balance
        if (customer.wallet < finalPrice) {
            return res.status(400).json({ message: 'Insufficient wallet balance' });
        }

        // Deduct the price from the user's wallet
        customer.wallet -= finalPrice;
        // make user wallet it 2 decimal
        customer.wallet = customer.wallet.toFixed(2);

        await customer.save();

        // // Create a new order
        const newOrder = new CollentionOrderModel({
            customer_id: customer._id,
            product_id: product._id,
            product_name: product.name,
            price: product.price,
            final_price: finalPrice,
            discounted: discount,
        });

        const savedOrder = await newOrder.save();

        // save to IncomeAndExpenses
        const IncomeAndExpenses = new IncomeAndExpensesModel({
            customer_id: customer._id,
            label: "Purchase",
            type: "Expenses",
            product_id: product._id,
            product_name: product.name,
            price: finalPrice,
        });
         IncomeAndExpenses.save();

        // Respond with success
        res.status(201).json({
            message: 'Purchase successful',
            savedOrder,
            customer,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
