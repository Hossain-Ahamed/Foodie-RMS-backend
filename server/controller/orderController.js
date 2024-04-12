const Order = require("../model/orderModel");
const Cart = require("../model/cartModel");
const Table = require("../model/tableModel");
const Dish = require("../model/dishesModel");
const cartModel = require("../model/cartModel");
const membershipModel = require("../model/membershipModel");
const userModel = require("../model/userModel");
const { responseError } = require("../utils/utility");
const orderModel = require("../model/orderModel");
const { query } = require("express");
const branchModel = require("../model/branchModel");
const couponModel = require("../model/couponModel");
const restaurantModel = require("../model/restaurantModel");

const getOrderDetailsBeforeCheckout = async (req, res) => {
  try {
    const { email, branchID, res_id } = req.params;

    const checkUser = await userModel.findOne({ email: email });
    if (!checkUser) {
      return res.status(401).json("Invalid User");
    }
    const checkCart = await cartModel.find({
      branchID: branchID,
      user_id: checkUser._id,
    });

    const dishDataPromises = checkCart.map(async (cartItem, index) => {
      const dishData = await Dish.findById(cartItem.dish_id).select(
        "title img"
      );

      // Check if dishData is null, if so, delete the corresponding cart item
      if (!dishData) {
        console.log(
          `Dish not found for cart item at index ${index}. Deleting...`
        );
        await cartModel.findByIdAndDelete(cartItem._id);
        return null; // Returning null if dishData is not found
      }

      return {
        ...cartItem.toObject(),
        dishId: dishData._id,
        title: dishData.title,
      }; // Merge cartItem and dishData
    });

    // Wait for all promises to resolve
    const allDishDataWithCarts = await Promise.all(dishDataPromises);

    // console.log(allDishDataWithCarts); // This will contain merged properties of getCarts and dish_data for each cart item

    const validDishDataWithCarts = allDishDataWithCarts.filter(
      (item) => item !== null
    );

    const deleteCart = await cartModel
      .deleteMany({ user_id: checkUser._id, branchID: { $ne: branchID } })
      .exec(); // Delete the user
    // Calculate the total price for all items
    let totalPrice = 0;
    for (const item of validDishDataWithCarts) {
      totalPrice += item.totalPrice;
    }
    const checkMembership = await membershipModel.findOne({
      res_id: res_id,
      memberShip: { $elemMatch: { $eq: checkUser._id } },
    });

    let discount;
    if (checkMembership) {
      discount = (checkMembership.percentageOffer / 100) * totalPrice;
      if (discount > checkMembership.MaximumLimit_in_TK) {
        discount = checkMembership.MaximumLimit_in_TK;
      }
      // totalPrice -= discount;
    } else {
      discount = 0;
    }

    res.status(200).send({
      dishes: validDishDataWithCarts,
      subtotal: parseFloat(totalPrice.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      total: parseFloat((totalPrice - discount).toFixed(2)),
    });
  } catch (error) {
    responseError(res, 500, error);
  }
};

const getOrderDetailsBeforeCheckoutForOffsite = async (req, res) => {
  try {
    const { email } = req.params;

    const checkUser = await userModel.findOne({ email: email });
    if (!checkUser) {
      return res.status(401).json("Invalid User");
    }
    const checkCart = await cartModel.find({
      user_id: checkUser._id,
    });
    if (checkCart.length <= 0) {
      return responseError(res, 404, "cart Not found");
    }

    const dishDataPromises = checkCart.map(async (cartItem, index) => {
      const dishData = await Dish.findById(cartItem.dish_id).select(
        "title img"
      );

      // Check if dishData is null, if so, delete the corresponding cart item
      if (!dishData) {
        console.log(
          `Dish not found for cart item at index ${index}. Deleting...`
        );
        await cartModel.findByIdAndDelete(cartItem._id);
        return null; // Returning null if dishData is not found
      }

      return {
        ...cartItem.toObject(),
        dishId: dishData._id,
        title: dishData.title,
      }; // Merge cartItem and dishData
    });

    // Wait for all promises to resolve
    const allDishDataWithCarts = await Promise.all(dishDataPromises);

    // console.log(allDishDataWithCarts); // This will contain merged properties of getCarts and dish_data for each cart item

    const validDishDataWithCarts = allDishDataWithCarts.filter(
      (item) => item !== null
    );

    // Calculate the total price for all items
    let totalPrice = 0;
    for (const item of validDishDataWithCarts) {
      totalPrice += item.totalPrice;
    }
    const res_data = await restaurantModel
      .findById(checkCart[0]?.res_id)
      .select("res_name");
    const branch_data = await branchModel
      .findById(checkCart[0]?.branchID)
      .select("branch_name");

    res.status(200).send({
      dishes: validDishDataWithCarts,
      subtotal: parseFloat(totalPrice.toFixed(2)),
      res_id: checkCart[0]?.res_id,
      branchID: checkCart[0]?.branchID,
      res_name: res_data?.res_name,
      branch_name: branch_data?.branch_name,
    });
  } catch (error) {
    responseError(res, 500, error);
  }
};

const updateOrder = async (req, res) => {};

const readOrder = async (req, res) => {};

const deleteOrder = async (req, res) => {};

const createOrderForOnsite = async (req, res) => {
  try {
    const { email } = req.params;
    const { table_id, branchID, res_id } = req.body;

    try {
      const user = await userModel.findOne({ email: email });
      const checkCart = await cartModel.find({
        user_id: user?._id,
        branchID: branchID,
      });
      let message = "Order Placed #token- ! waiting for Admin Approval";
      let token;
      const data = await totalPriceAndItems(res_id, branchID, checkCart, user);

      const paymentTypesOfTheBranch = await branchModel
        .findById(branchID)
        .select("paymentTypes");
      console.log(paymentTypesOfTheBranch);
      let order;
      if (paymentTypesOfTheBranch?.paymentTypes == "PayLater") {
        const PreviousIncompletedOrder = await orderModel.findOne({
          res_id: res_id,
          branchID: branchID,
          user_id: user?._id,
          order_from: "ONSITE",
          $ne: { status: "Completed" },
        });

        if (PreviousIncompletedOrder) {
          console.log("pay Later+ prev order");
          const push_data = {
            finalPrice: data?.finalPrice + PreviousIncompletedOrder.finalPrice,
            Items: [...PreviousIncompletedOrder?.Items, ...data?.Items],
            subTotalPrice:
              data?.subTotalPrice + PreviousIncompletedOrder.subTotalPrice,
            discountedPrice:
              data?.discountedPrice + PreviousIncompletedOrder.discountedPrice,
            finalPrice: data?.finalPrice + PreviousIncompletedOrder.finalPrice,
            table: table_id,
          };

          order = await orderModel.findByIdAndUpdate(
            PreviousIncompletedOrder._id,
            { $set: push_data },
            { new: true }
          );
          message = `Order Placed ! waiting for Admin Approval`;
          token = ` #Token-${PreviousIncompletedOrder?.token}`;
        } else {
          console.log("pay Later+ no prev order");
          const genratedToken = await generateToken(res_id, branchID);
          order = await new orderModel({
            res_id,
            branchID,
            user_id: user?._id,
            address: user?.address,
            phone: user?.phone,
            token: genratedToken,
            finalPrice: data?.finalPrice,
            Items: data?.Items,
            vouchers: data?.vouchers,
            subTotalPrice: data?.subTotalPrice,
            discountedPrice: data?.discountedPrice,
            status: "Payment Pending",
            cash_status: "Not Paid",
            type_of_payment: "Cash On Delivery (COD)",
            order_from: "ONSITE",
            table: table_id,
          }).save();
          message = `Order Placed  ! waiting for Admin Approval`;
          token = ` #Token-${genratedToken}`;
        }
      } else {
        console.log("pay first");
        const genratedToken = await generateToken(res_id, branchID);
        order = await new orderModel({
          res_id,
          branchID,
          user_id: user?._id,
          address: user?.address,
          phone: user?.phone,
          token: genratedToken,
          finalPrice: data?.finalPrice,
          Items: data?.Items,
          vouchers: data?.vouchers,
          subTotalPrice: data?.subTotalPrice,
          discountedPrice: data?.discountedPrice,
          status: "Payment Pending",
          cash_status: "Not Paid",
          type_of_payment: "Cash On Delivery (COD)",
          order_from: "ONSITE",
          table: table_id,
        }).save();
        message = `🌟 Get ready to pay as our Customer Service arrives. Remember, we have pay first policy. 🍽️`;
        token = ` #Token-${genratedToken}`;
      }
      // const deleteCart = await cartModel.deleteMany({ user_id: user?._id });
      res.status(200).send({ order, message: message, token: token });
    } catch (error) {
      return responseError(res, 500, error);
    }
  } catch (error) {
    responseError(res, 500, error);
  }
};

const createOrderForOffsite = async (req, res) => {
  try {
    const { email } = req.params;
    const { couponCode, branchID } = req.body;
    console.log(req.body);
    try {
      const user = await userModel.findOne({ email: email });
      const checkCart = await cartModel.find({
        user_id: user?._id,
        branchID: branchID,
      });

      if (checkCart.length == 0) {
        res.status(404).send({ message: "Your Cart is Empty" });
      }

      const data = await totalPriceAndItemsForOffsite(
        checkCart[0].res_id,
        checkCart[0].branchID,
        checkCart,
        user
      );
      let discountAmmount = 0;
      if (couponCode) {
        discountAmmount = (
          await discountByApplyingCoupon(
            checkCart[0].res_id,
            checkCart[0].branchID,
            couponCode,
            data?.subTotalPrice || 0,
            email
          )
        ).discountedPrice;
      }

      const genratedToken = await generateToken(
        checkCart[0].res_id,
        checkCart[0].branchID
      );
      let order = await new orderModel({
        res_id: checkCart[0].res_id,
        branchID: checkCart[0].branchID,
        user_id: user?._id,
        address: user?.address,
        phone: user?.phone,
        token: genratedToken,
        finalPrice: (data?.subTotalPrice - discountAmmount).toFixed(1),
        Items: data?.Items,
        vouchers: couponCode || "",
        subTotalPrice: data?.subTotalPrice,
        discountedPrice: discountAmmount,
        status: "Payment Pending",
        cash_status: "Not Paid",
        type_of_payment: "Card",
        order_from: "OFFSITE",
        orderStatus: [
          {
            name: "Payment Pending",
            massage: "",
            time: Date.now(),
          },
        ],
      }).save();
      message = `🌟 Get ready to pay Remember, we have pay first policy. 🍽️`;
      token = ` #Token-${genratedToken}`;
      const deleteCart = await cartModel.deleteMany({ user_id: user?._id });
      res.status(200).send({ order, message: message, token: token });
    } catch (error) {
      return responseError(res, 500, error);
    }
  } catch (error) {
    responseError(res, 500, error);
  }
};

const discountByApplyingCoupon = async (
  res_id,
  branchID,
  couponCode,
  totalPrice,
  email
) => {
  try {
    var couponData = await couponModel.findOne({
      name: couponCode,
      res_id: res_id,
      branchID: branchID,
    });
    if (!couponData) {
      return {
        message: "No Coupon Found",
        discountedPrice: 0,
      };
    } else {
      const User_Data = await userModel.findOne({ email: email });
      const numberOfUsesCoupon = couponData.userCount.filter(
        (i) => i == User_Data?._id
      );
      if (numberOfUsesCoupon.length > couponData.maximumNumberOfUse) {
        return {
          message: "Maximum Number of Use is Exceeded.",
          discountedPrice: 0,
        };
      }
      if (couponData.from > new Date() || couponData.to < new Date()) {
        return {
          message: "This Coupon has been expired.",
          discountedPrice: 0,
        };
      }
      let discountedPrice = totalPrice * (couponData?.percentage / 100);
      if (discountedPrice > couponData?.maximumDiscountLimit) {
        discountedPrice = couponData?.maximumDiscountLimit;
      }
      return {
        message: "YAY! You got a Discount.",
        discountedPrice: discountedPrice,
      };
    }
  } catch (error) {
    throw error;
  }
};

const totalPriceAndItems = async (res_id, branchID, cartItems, user) => {
  const dishDataPromises = cartItems.map(async (cartItem, index) => {
    const dishData = await Dish.findById(cartItem.dish_id).select("title img");

    // Check if dishData is null, if so, delete the corresponding cart item
    if (!dishData) {
      console.log(
        `Dish not found for cart item at index ${index}. Deleting...`
      );
      await cartModel.findByIdAndDelete(cartItem._id);
      return null; // Returning null if dishData is not found
    }

    return {
      dishId: dishData?._id,
      title: dishData?.title,
      img: dishData?.img,
      addOn: cartItem?.addons,
      options: cartItem?.options,
      quantity: cartItem?.quantity,
      basePrice: cartItem?.basePrice,
      extraPrice: cartItem?.extraPrice || 0,
      VAT: cartItem?.VAT,
      totalPrice: cartItem?.totalPrice,
      dishStatus: "Order-Placed",
    }; // Merge cartItem and dishData
  });

  // Wait for all promises to resolve
  const allDishDataWithCarts = await Promise.all(dishDataPromises);

  // console.log(allDishDataWithCarts); // This will contain merged properties of getCarts and dish_data for each cart item

  const validDishDataWithCarts = allDishDataWithCarts.filter(
    (item) => item !== null
  );
  // Calculate the total price for all items
  let totalPrice = 0;
  for (const item of validDishDataWithCarts) {
    totalPrice += item.totalPrice;
  }
  const checkMembership = await membershipModel.findOne({
    res_id: res_id,
    memberShip: { $elemMatch: { $eq: user._id } },
  });

  let discount;
  let vouchers = "";
  if (checkMembership) {
    discount = (checkMembership.percentageOffer / 100) * totalPrice;
    if (discount > checkMembership.MaximumLimit_in_TK) {
      discount = checkMembership.MaximumLimit_in_TK;
    }
    // totalPrice -= discount;
    vouchers = "MemberShip";
  } else {
    discount = 0;
  }

  return {
    Items: validDishDataWithCarts,
    vouchers: vouchers,
    subTotalPrice: totalPrice,
    discountedPrice: discount,
    finalPrice: totalPrice - discount,
  };
};

const totalPriceAndItemsForOffsite = async (
  res_id,
  branchID,
  cartItems,
  user
) => {
  const dishDataPromises = cartItems.map(async (cartItem, index) => {
    const dishData = await Dish.findById(cartItem.dish_id).select("title img");

    // Check if dishData is null, if so, delete the corresponding cart item
    if (!dishData) {
      console.log(
        `Dish not found for cart item at index ${index}. Deleting...`
      );
      await cartModel.findByIdAndDelete(cartItem._id);
      return null; // Returning null if dishData is not found
    }

    return {
      dishId: dishData?._id,
      title: dishData?.title,
      img: dishData?.img,
      addOn: cartItem?.addons,
      options: cartItem?.options,
      quantity: cartItem?.quantity,
      basePrice: cartItem?.basePrice,
      extraPrice: cartItem?.extraPrice || 0,
      VAT: cartItem?.VAT,
      totalPrice: cartItem?.totalPrice,
      dishStatus: "Order-Placed",
    }; // Merge cartItem and dishData
  });

  // Wait for all promises to resolve
  const allDishDataWithCarts = await Promise.all(dishDataPromises);

  // console.log(allDishDataWithCarts); // This will contain merged properties of getCarts and dish_data for each cart item

  const validDishDataWithCarts = allDishDataWithCarts.filter(
    (item) => item !== null
  );
  // Calculate the total price for all items
  let totalPrice = 0;
  for (const item of validDishDataWithCarts) {
    totalPrice += item.totalPrice;
  }
  const checkMembership = await membershipModel.findOne({
    res_id: res_id,
    memberShip: { $elemMatch: { $eq: user._id } },
  });

  return {
    Items: validDishDataWithCarts,
    subTotalPrice: totalPrice,
  };
};
async function generateToken(res_id, branchID) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await orderModel
      .find({
        createdAt: { $gte: today }, // Filter orders for today or later
        branchID: branchID, // Match the branchID
      })
      .sort({ createdAt: -1 }) // Sort in descending order based on createdAt timestamp
      .limit(1) // Limit to only one result (the latest order)
      .select("token"); // Include only the 'token' field in the result

    console.log(1, result);

    let token;

    if (result.length > 0) {
      // If there is a previous order for the day, increment its token
      token = result[0].token + 1;
    } else {
      // If there are no previous orders for the day, start from 1
      token = 1;
    }

    return token;
  } catch (error) {
    responseError(res, 500, error);
  }
}

const onGoingOrderForOnSite = async (req, res) => {
  try {
    const { res_id, branchID, email } = req.params;
    const user = await userModel.findOne({ email: email });
    const allOrderOngoing = await orderModel.find({
      user_id: user?._id,
      status: { $ne: "Completed" },
      branchID: branchID,
    });
    res.status(200).send(allOrderOngoing);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const allCompleteOrderForOnSite = async (req, res) => {
  try {
    const { res_id, branchID, email } = req.params;
    const user = await userModel.findOne({ email: email });
    const allOrderComplete = await orderModel.find({
      user_id: user?._id,
      status: "Completed",
      branchID: branchID,
    });
    res.status(200).send(allOrderComplete);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const getDiscountByCoupon = async (req, res) => {
  try {
    const { res_id, branchID, couponCode, totalPrice, email } = req.body;
    const discountData = await discountByApplyingCoupon(
      res_id,
      branchID,
      couponCode,
      totalPrice,
      email
    );

    res.status(200).send(discountData);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const adminPlaceOrder = async (req, res) => {
  try {
    const { res_id, branchID } = req.params;
    const { userData, dish, tableNo } = req.body;
    const data = {};
    let discount;
    let vouchers = "";
    if (!(userData?._id == "" || userData?._id == "null")) {
      data.address = await userModel.findById(userData?._id);
      data.phone = userData?.phone;
      data.user_id = userData?._id;

      const checkMembership = await membershipModel.findOne({
        res_id: res_id,
        memberShip: { $elemMatch: { $eq: userData?._id } },
      });

      if (checkMembership) {
        discount = (checkMembership.percentageOffer / 100) * totalPrice;
        if (discount > checkMembership.MaximumLimit_in_TK) {
          discount = checkMembership.MaximumLimit_in_TK;
        }
        // totalPrice -= discount;
        vouchers = "MemberShip";
      } else {
        discount = 0;
      }
    } else {
      data.phone = "000-000-000";
    }
    const dish_data = dish.map((item) => ({
      totalPrice: item?.totalPrice * item?.quantity,
      title: item?.name,
      img: item?.img,
      dish_id: item?.dish_id,
      quantity: item?.quantity,
      dishStatus: "Approved",
      basePrice: item?.basePrice ? item?.basePrice : 0,
      extraPrice: item?.extra ? item?.extra : 0,
      VAT: item.VAT ? item.VAT : 0,
      addOn: item?.addOn,
      options: item?.options,
    }));
    data.res_id = res_id;
    data.branchID = branchID;
    const token = await generateToken(res_id, branchID);
    data.token = token;
    data.Items = dish_data;
    data.vouchers = vouchers;
    data.discountedPrice = discount;

    const subtotal = dish_data.reduce(
      (sum, item) => sum + (item?.totalPrice || 0),
      0
    );

    const check_branch_payment_type = await branchModel.findById(branchID).select("paymentTypes");

    if(check_branch_payment_type.paymentTypes != "PayLater"){
      data.cash_status = "Cash Recieved";
    }

    data.subTotalPrice = subtotal;
    data.finalPrice = subtotal - discount;
    data.table = tableNo;
   

    const order = await new orderModel(data).save();

    res.status(200).send({
      order: order,
      message: `🌟 Bill ${subtotal - discount} 🍽️`,
      token: ` #Token-${token}`,
    });
  } catch (error) {
    responseError(res, error);
  }
};

module.exports = {
  getOrderDetailsBeforeCheckout,
  updateOrder,
  deleteOrder,
  readOrder,
  createOrderForOnsite,
  createOrderForOffsite,
  onGoingOrderForOnSite,
  allCompleteOrderForOnSite,
  getDiscountByCoupon,
  getOrderDetailsBeforeCheckoutForOffsite,
  adminPlaceOrder
};
