const express = require('express');
const router = express.Router();
const {  CollentionOrderModel   } = require('../DB/Model');

// get all collection orders
router.get('/', async (req, res) => {
    try {
        let limit = req.query.limit || 10;
        let paginator = req.query.paginator || 1;
        if (isNaN(paginator) || paginator <= 0) {
            paginator = 1;
        }
        const collectionOrders = await CollentionOrderModel.find().limit(limit).skip((paginator-1)*limit);
        if (!collectionOrders) {
            return res.status(404).json({ message: 'Collection Order not found' });
        }
        res.status(200).json(collectionOrders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get collection order by id customer
router.get('/customerId/:id', async (req, res) => {
    try {
        const id = req.params.id ;
        const collectionOrders = await CollentionOrderModel.find({customer_id : id});
        if (!collectionOrders) {
            return res.status(404).json({ message: 'Collection Order not found' });
        }
        res.status(200).json(collectionOrders); // Return the Collection Order details
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;