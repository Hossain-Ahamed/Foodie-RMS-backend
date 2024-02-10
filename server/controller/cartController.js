const Cart = require("../model/cartModel");
const Table = require("../model/tableModel");
const Dish = require("../model/dishesModel");

const createCartForTable = async (req, res) => {
  try {
    const {
      res_id,
      branchID,
      user_id,
      table_id,
      dishID,
      dishQuantity,
      addOn,
      phone,
      order_from,
    } = req.body;

    if (order_from == "ONSHORE") {
      // Check if the table is vacant
      const table = await Table.findById(table_id);
      if (!table || table.status !== "Vacant") {
        return res
          .status(400)
          .json({ msg: "Table not available or not vacant" });
      }

      // Check if a cart exists for the given phone number
      const existingCart = await Cart.findOne({ user_id });

      if (existingCart) {
        // Update existing cart item
        existingCart.Items.forEach((item) => {
          if (
            item.dishID.equals(dishID) &&
            item.addOn.some((a) => a.name === addOn.name)
          ) {
            item.dishQuantity = dishQuantity;
            // Update dishTotalPrice based on new quantity
            item.dishTotalPrice = calculateDishTotalPrice(dishID, dishQuantity);
          }
        });

        await existingCart.save();

        return res.status(200).json(existingCart);
      }

      // Create a new cart
      const newCart = new Cart({
        res_id,
        branchID,
        user_id,
        Items: [
          {
            dishID,
            dishQuantity,
            dishTotalPrice: calculateDishTotalPrice(dishID, dishQuantity),
            addOn,
          },
        ],
      });

      await newCart.save();

      // Update table status to 'Occupied'
      table.status = "Occupied";
      await table.save();

      res.status(201).json(newCart);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Helper function to calculate dish total price
const calculateDishTotalPrice = async (dishID, dishQuantity) => {
  try {
    const dish = await Dish.findById(dishID);
    if (!dish) {
      throw new Error(`Dish with ID ${dishID} not found`);
    }

    // Calculate the total price based on dish price and quantity
    const total = dish.price * parseInt(dishQuantity);
    return total;
  } catch (error) {
    throw new Error(`Error calculating dish total price: ${error.message}`);
  }
};

const updateCart = async (req, res) => {
    try {
      const { user_id, dishID, dishQuantity, addOn } = req.body;
  
      // Check if the cart exists for the given user
      const existingCart = await Cart.findOne({ user_id });
  
      if (existingCart) {
        // Check if the product already exists in the cart
        const existingItem = existingCart.Items.find(
          (item) =>
            item.dishID.equals(dishID) &&
            item.addOn.some((a) => a.name === addOn.name)
        );
  
        if (existingItem) {
          // Product already exists, increase quantity
          existingItem.dishQuantity += dishQuantity;
          // Update dishTotalPrice based on new quantity
          existingItem.dishTotalPrice = calculateDishTotalPrice(
            dishID,
            existingItem.dishQuantity
          );
        } else {
          // Product doesn't exist, add a new item
          existingCart.Items.push({
            dishID,
            dishQuantity,
            dishTotalPrice: calculateDishTotalPrice(dishID, dishQuantity),
            addOn,
          });
        }
  
        await existingCart.save();
  
        return res.status(200).json(existingCart);
      } else {
        return res.status(400).json({ msg: "Cart not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  };
  
  const readCart = async (req, res) => {
    try {
      const { user_id } = req.body;
  
      // Check if the cart exists for the given user
      const existingCart = await Cart.findOne({ user_id });
  
      if (existingCart) {
        return res.status(200).json(existingCart);
      } else {
        return res.status(400).json({ msg: "Cart not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  };
  
  const deleteCart = async (req, res) => {
    try {
      const { user_id } = req.body;
  
      // Delete the cart for the given user
      await Cart.findOneAndDelete({ user_id });
  
      return res.status(200).json({ msg: "Cart deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  };
  

module.exports = {
  createCartForTable,
  updateCart,
  deleteCart,
  readCart
};
