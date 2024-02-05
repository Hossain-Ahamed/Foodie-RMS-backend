const Order = require('../model/orderModelFoodie');
const Cart = require('../model/cartModelForTable');
const Table = require('../model/tableModel');
const Dish = require('../model/dishesModel');

const createOrderForTable = async (req, res) => {
    try {
        const { table_id, paymentStatus,vouchar } = req.body;

        // Check if a cart exists for the given table
        const cart = await Cart.findOne({ table_id });

        if (!cart || cart.Items.length === 0) {
            return res.status(400).json({ msg: 'No items in the cart for the specified table' });
        }

        // Calculate order total and other details
        const totalAmount = calculateOrderTotal(cart.Items);
        // const discountedPrice = calculateDiscountedPrice(totalAmount, vouchers);
        // const finalPrice = calculateFinalPrice(totalAmount, discountedPrice);

        // Create a new order
        const newOrder = new Order({
            res_id: cart.res_id,
            branchID: cart.branchID,
            table_id,
            status: paymentStatus === 'Paid' ? 'Processed' : 'Payment Pending',
            totalAmount: totalAmount.toFixed(2),
            Items: cart.Items,
            orderNote: cart.orderNote,
            address: cart.address,
            vouchers: cart.vouchers,
            subTotalPrice: totalAmount,
            discountedPrice,
            finalPrice : totalAmount,
            status: paymentStatus === 'Paid' ? 'Processed' : 'Payment Pending',
            type_of_payment: cart.type_of_payment,
            transactionId: cart.transactionId,
            phone: cart.phone,
            orderStatus: [],
        });

        await newOrder.save();

        // If payment is done, delete the cart and update table status
        if (paymentStatus === 'Paid') {
            await Cart.findOneAndDelete({ table_id });
            const table = await Table.findById(table_id);
            if (table) {
                table.status = 'Vacant';
                await table.save();
            }
        }

        res.status(201).json(newOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// Helper function to calculate order total
const calculateOrderTotal = (items) => {
    return items.reduce((acc, item) => acc + item.dishTotalPrice, 0);
};

// Helper function to calculate discounted price
const calculateDiscountedPrice = (totalAmount, vouchers) => {
    // Implement your logic to calculate discounted price based on vouchers
    // For simplicity, let's assume no discounts for now
    return totalAmount;
};

// Helper function to calculate final price
const calculateFinalPrice = (totalAmount, discountedPrice) => {
    // Implement your logic to calculate final price
    // For simplicity, let's use discounted price as the final price
    return discountedPrice;
};

module.exports = {
    createOrderForTable,
};
