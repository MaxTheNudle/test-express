const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    rate_discount: { type: Number, default: null },
    wallet: { type: Number, default: 0 },
}, { timestamps: true });


const CollentionOrderSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    product_name: { type: String, required: true },
    price: { type: Number, required: true },
    final_price: { type: Number, required: true },
    discounted: { type: Number, required: true },
    
}, { timestamps: true });


const IncomeAndExpensesSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    label: { type: String, required: true },
    type: { type: String, required: true, enum: ['Income', 'Expenses'] },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    product_name: { type: String,  default: "" },
    price: { type: Number, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true });
  
  


const CustomerModel = mongoose.model('Customer', customerSchema);
const CollentionOrderModel = mongoose.model('CollentionOrder', CollentionOrderSchema);
const IncomeAndExpensesModel = mongoose.model('IncomeAndExpenses', IncomeAndExpensesSchema);
const ProductModel = mongoose.model('Product', productSchema);

module.exports = { CustomerModel, CollentionOrderModel , IncomeAndExpensesModel , ProductModel };