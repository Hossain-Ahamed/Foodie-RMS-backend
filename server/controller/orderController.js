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
const restaurantOnlineTransactionBillModel = require("../model/restaurantOnlineTransactionBillModel");
const employeeModel = require("../model/employeeModel");
const axios = require("axios");
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
    const { email, type } = req.params;

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
      .select("branch_name takewayCharge deliveryCharge");

    let shippingCharge = 0;
    if (type == "Delivery") {
      shippingCharge = branch_data?.deliveryCharge;
    } else {
      shippingCharge = branch_data?.takewayCharge;
    }

    res.status(200).send({
      dishes: validDishDataWithCarts,
      subtotal: parseFloat(totalPrice.toFixed(2)),
      res_id: checkCart[0]?.res_id,
      branchID: checkCart[0]?.branchID,
      res_name: res_data?.res_name,
      branch_name: branch_data?.branch_name,
      shippingCharge,
    });
  } catch (error) {
    responseError(res, 500, error);
  }
};

const updateOrder = async (req, res) => {};

const readOrder = async (req, res) => {};

const deleteOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    const order_data = await orderModel.findById(orderID);
    if (!order_data ){
      return responseError(res,404,"No Order Found!");
    }
    if (order_data?.status == "Delivered" ){
      return res.status(400).send({message: "This Order is already Delivered!"})
    }
    
    const deleteOrder = await orderModel.findByIdAndUpdate(orderID, {
      status: "Cancelled",
    });
    if(order_data.order_from == "OFFSITE" && order_data.cash_status == "Paid"){
      await restaurantOnlineTransactionBillModel.findOneAndUpdate(
        { branchID: order_data?.branchID }, // Find the document with this branchID
        { // Update fields
            NeedToPay: NeedToPay - order_data?.finalPrice, // Update NeedToPay field
            $push: { // Push a new object into billHistory array
                billHistory: {
                    orderID: orderID,
                    transactionID: "Refund",
                    intent_methodID: "Refund",
                    methodID: "Refund",
                    price: order_data?.finalPrice
                }
            }
        },
        {new:true}
    );
      
    }
    res.status(200).send(true);
  } catch (error) {
    responseError(res, 500, error);
  }
};
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
            status: "New Dish Added",
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
      const deleteCart = await cartModel.deleteMany({ user_id: user?._id });
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
    const { couponCode, branchID, orderNote } = req.body;
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

      const branch_data = await branchModel
        .findById(branchID)
        .select("takewayCharge deliveryCharge");

      let shippingCharge = 0;
      if (orderNote == "Delivery") {
        shippingCharge = branch_data?.deliveryCharge;
      } else {
        shippingCharge = branch_data?.takewayCharge;
      }
      console.log(user);
      let order = await new orderModel({
        res_id: checkCart[0].res_id,
        branchID: checkCart[0].branchID,
        user_id: user?._id,
        address: user?.address,
        phone: user?.phone,
        token: genratedToken,
        orderNote,
        finalPrice: (
          data?.subTotalPrice +
          shippingCharge -
          discountAmmount
        ).toFixed(1),
        shippingCharge: shippingCharge,
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
            message: "",
            time: Date.now(),
          },
        ],
      }).save();
      message = `🌟 Get ready to pay Remember, we have pay first policy. 🍽`;
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
      addOn: cartItem?.addOn,
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
      addOn: cartItem?.addOn,
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
    let discount = 0;
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

    const check_branch_payment_type = await branchModel
      .findById(branchID)
      .select("paymentTypes");

    if (check_branch_payment_type.paymentTypes != "PayLater") {
      data.cash_status = "Paid";
    }
    data.status = "Processing";
    data.subTotalPrice = subtotal;
    data.finalPrice = subtotal - discount;
    data.table = tableNo;

    const order = await new orderModel(data).save();

    res.status(200).send({
      order: order,
      message: `🌟${
        check_branch_payment_type.paymentTypes != "PayLater"
          ? "Pay First Service"
          : "Pay Later"
      }- Bill  ${subtotal - discount} 🍽️`,
      token: ` #Token-${token}`,
    });
  } catch (error) {
    responseError(res, 500, error);
  }
};

const OngoingOrderList = async (req, res) => {
  try {
    const {
      typeOfRange,
      startingDate,
      endingDate,
      currentPage,
      numberOfSizeInTableData,
      search,
      role,
    } = req.query;
    const { res_id, branchID } = req.params;

    let selectData = "-__v -OTP -shippingCharge";

    const filter = {
      res_id: res_id,
      branchID: branchID,
      
    };
    if(role == "Admin" || role == "Super-Admin"){
      filter.status = { $nin: ["Delivered", "Cancelled"] };
    }else{
      //for custommer service
      filter.status =  { $nin: ["Delivered", "Cancelled", "Processed And Ready to Ship","Processing","Completed","Shipped"] };
    }

    // if (req.role === "Delivery Man") {
    //     filter["deliveryPartner._id"] = req.adminID;
    //     selectData = '-__v -OTP -shippingCharge -order_item -address';
    // }

    if (typeOfRange === "Last 7 Days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filter.createdAt = { $gte: sevenDaysAgo };
    } else if (typeOfRange === "Last 30 Days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filter.createdAt = { $gte: thirtyDaysAgo };
    } else if (typeOfRange === "Custom" && startingDate && endingDate) {
      // If Custom range selected, check the startDate and endingDate
      const endDate = new Date(endingDate);
      endDate.setHours(23, 59, 59); // Set the time to the end of the day
      filter.createdAt = {
        $gte: new Date(startingDate),
        $lte: endDate,
      };
    }

    if (search) {
      filter.$or = [
        { phone: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
        { cash_status: { $regex: search, $options: "i" } },
      ];
    }
    const page = parseInt(currentPage) || 0;
    const size = parseInt(numberOfSizeInTableData) || 15;
    const skipCount = page * size;

    const [arrayData, totalCount] = await Promise.all([
      orderModel
        .find(filter)
        .select(selectData)
        .sort({ updatedAt: -1 })
        .skip(skipCount)
        .limit(size)
        .populate("user_id"),
      orderModel.countDocuments(filter),
    ]);

    if (!arrayData || arrayData.length === 0) {
      return res.status(200).send({ DataArrayList: [], count: 0 });
    }
    const branchData = await branchModel
      .findById(branchID)
      .select("paymentTypes");

    res.status(200).json({
      DataArrayList: arrayData,
      count: totalCount,
      paymentTypes: branchData?.paymentTypes,
    });
  } catch (error) {
    console.error("Error while fetching orders", error);
    res.status(500).json({ message: "Server error" });
  }
};

const AllOrderList = async (req, res) => {
  try {
    const {
      typeOfRange,
      startingDate,
      endingDate,
      currentPage,
      numberOfSizeInTableData,
      search,
    } = req.query;
    const { res_id, branchID } = req.params;

    let selectData = "-__v -OTP -shippingCharge";

    const filter = {
      res_id: res_id,
      branchID: branchID,
    };

    // if (req.role === "Delivery Man") {
    //     filter["deliveryPartner._id"] = req.adminID;
    //     selectData = '-__v -OTP -shippingCharge -order_item -address';
    // }

    if (typeOfRange === "Last 7 Days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filter.createdAt = { $gte: sevenDaysAgo };
    } else if (typeOfRange === "Last 30 Days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filter.createdAt = { $gte: thirtyDaysAgo };
    } else if (typeOfRange === "Custom" && startingDate && endingDate) {
      // If Custom range selected, check the startDate and endingDate
      const endDate = new Date(endingDate);
      endDate.setHours(23, 59, 59); // Set the time to the end of the day
      filter.createdAt = {
        $gte: new Date(startingDate),
        $lte: endDate,
      };
    }

    if (search) {
      filter.$or = [
        { phone: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
        { cash_status: { $regex: search, $options: "i" } },
      ];
    }
    const page = parseInt(currentPage) || 0;
    const size = parseInt(numberOfSizeInTableData) || 15;
    const skipCount = page * size;

    const [arrayData, totalCount] = await Promise.all([
      orderModel
        .find(filter)
        .select(selectData)
        .sort({ _id: -1 })
        .skip(skipCount)
        .limit(size)
        .populate("user_id"),
      orderModel.countDocuments(filter),
    ]);

    if (!arrayData || arrayData.length === 0) {
      return res.status(200).send({ DataArrayList: [], count: 0 });
    }
    const branchData = await branchModel
      .findById(branchID)
      .select("paymentTypes");

    res.status(200).json({
      DataArrayList: arrayData,
      count: totalCount,
      paymentTypes: branchData?.paymentTypes,
    });
  } catch (error) {
    console.error("Error while fetching orders", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateOrderSingleItem = async (req, res) => {
  try {
    const { itemId, newStatus } = req.body; // Assuming you receive itemId and newStatus from the request body

    // Validate itemId and newStatus
    if (!itemId || !newStatus) {
      return res
        .status(400)
        .json({ message: "itemId and newStatus are required." });
    }

    // Update the dishStatus of the specified item
    const updatedOrder = await orderModel.findOneAndUpdate(
      { "Items._id": itemId }, // Find the order with the specified itemId in the Items array
      { $set: { "Items.$.dishStatus": newStatus } }, // Update the dishStatus of the found item
      { new: true } // Return the modified document
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ message: "Order not found or item not updated." });
    }

    res
      .status(200)
      .json({ message: "Item dishStatus updated successfully.", updatedOrder });
  } catch (error) {
    console.error("Error while updating item dishStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const dataForPayment = async (req, res) => {
  try {
    const { order_id } = req.params;
    const get_order_data = await orderModel.findById(order_id);
    if (get_order_data) {
      res
        .status(200)
        .send({ Details: get_order_data, price: get_order_data.finalPrice });
    }
  } catch (error) {
    responseError(res, 500, error);
  }
};

const updateOrderByIdForPayment = async (req, res) => {
  try {
    const { orderID, transactionID, intent_methodID, methodID, price } =
      req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderID,
      {
        $set: {
          transactionId: transactionID,
          cash_status: "Paid",
          status: "Processing",
        },
        $push: {
          orderStatus: {
            name: "Paid",
            time: new Date().toISOString(),
            message: `Transaction ID : ${transactionID}`,
          },
        },
      },
      { new: true }
    );
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
      timeZone: "Asia/Dhaka",
    });
    const currentYear = currentDate.getFullYear();

    const existingMonth = await restaurantOnlineTransactionBillModel.findOne({
      branchID: updatedOrder?.branchID,
      month: currentMonth,
      year: currentYear,
    });
    if (!existingMonth) {
      const save = await new restaurantOnlineTransactionBillModel({
        res_id: updatedOrder?.res_id,
        branchID: updatedOrder?.branchID,
        month: currentMonth,
        year: currentYear,
        NeedToPay: updatedOrder?.finalPrice,
        billHistory: [
          {
            orderID: updatedOrder?._id,
            transactionID: transactionID,
            intent_methodID,
            methodID,
            price,
          },
        ],
      }).save();
    } else {
      existingMonth.NeedToPay += updatedOrder?.finalPrice;
      existingMonth.billHistory.push({
        orderID: updatedOrder?._id,
        transactionID: transactionID,
        intent_methodID,
        methodID,
        price,
      });
      existingMonth.save();
    }

    res.status(200).send(true);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const UpdateOrder_ReceivedMoney_PayFirst_branches_Onsite_Order = async (
  req,
  res
) => {
  try {
    const { orderID } = req.params;

    // Update the dishStatus of all items
    const result = await orderModel.findByIdAndUpdate(
      orderID,
      {
        $set: {
          "Items.$[].dishStatus": "Approved",
          status: "Processing",
          cash_status: "Paid",
        },
      }, // Update the dishStatus of all items
      { new: true }
    );

    res.status(200).send(result);
  } catch (error) {
    console.error("Error while updating dishStatus:", error);
  }
};

const UpdateOrder_ReceivedMoney_PayLast_branches_Onsite_Order = async (
  req,
  res
) => {
  try {
    const { orderID } = req.params;
    console.log("pay later go money");
    const result = await orderModel.findByIdAndUpdate(
      orderID,
      {
        $set: {
          status: "Delivered",
          cash_status: "Paid",
        },
      }, // Update the dishStatus of all items
      { new: true }
    );
    res.status(200).send(result);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const approveDishItem = async (req, res) => {
  try {
    const { orderID } = req.params;
    const result = await orderModel.findOneAndUpdate(
      {
        _id: orderID,
        "Items.dishStatus": "Order-Placed", // Match orders with at least one item with "Order-Placed" status
      },
      {
        $set: {
          "Items.$[item].dishStatus": "Approved", // Update all items with "Order-Placed" status to "Approved"
          status: "Processing",
        },
      },
      {
        arrayFilters: [{ "item.dishStatus": "Order-Placed" }], // Filter array elements to only update those with "Order-Placed" status
        new: true,
      }
    );

    if (!result) {
      return res
        .status(400)
        .json({ error: "Order not found or items already approved." });
    }

    // Send the updated order back to the client
    res.status(200).json(result);
  } catch (error) {
    console.error("Error approving dish item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const order_Prepared_and_ready_to_serve_By_KOT_Approval = async (req, res) => {
  try {
    const { orderID } = req.params;
    const order_data = await orderModel.findOne({ _id: orderID });
    if (!order_data) {
      return responseError(res, 404, "No such Order exist");
    }
    const branch = await branchModel
      .findById(order_data?.branchID)
      .select("paymentTypes");
    let result;
    if (order_data?.order_from == "ONSITE") {
      if (!branch.paymentTypes == "PayLater") {
        result = await orderModel.findOneAndUpdate(
          {
            _id: orderID,
            "Items.dishStatus": "Processing", // Match orders with at least one item with "Order-Placed" status
          },
          {
            $set: {
              "Items.$[item].dishStatus": "Processed", // Update all items with "Order-Placed" status to "Approved"
              status: "Ready to serve",
            },
          },
          {
            arrayFilters: [{ "item.dishStatus": "Processing" }], // Filter array elements to only update those with "Order-Placed" status
            new: true,
          }
        );
      } else {
        //onsite +  Pay later
        result = await orderModel.findByIdAndUpdate(
          orderID,
          {
            $set: {
              "Items.$[].dishStatus": "Processed",
              status: "Ready to serve",
            },
          }, // Update the dishStatus of all items
          { new: true }
        );
      }
    } else {
      result = await orderModel.findByIdAndUpdate(
        orderID,
        {
          $set: {
            "Items.$[].dishStatus": "Processed",
            status: "Processed And Ready to Ship",
          },
          $push: {
            orderStatus: {
              name: "Processed And Ready to Ship",
              time: new Date(),
              message: "Your meal is ready",
            },
          },
        }, // Update the dishStatus of all items
        { new: true }
      );
    }

    res.status(200).send(true);
  } catch (error) {
    responseError(res, 500, error);
  }
};

const order_Is_being_Prepared_By_KOT_Approval = async (req, res) => {
  try {
    const { orderID } = req.params;
    const order_data = await orderModel.findById(orderID);
    if(!order_data){
      return responseError(res,404);
    }
    let result;
    console.log(order_data,2)
    if (order_data.order_from == "OFFSITE") {
      result = await orderModel.findOneAndUpdate(
        {
          _id: orderID,
        },
        {
          $set: {
            "Items.$[item].dishStatus": "Processing", // Update all items with "Order-Placed" status to "Approved"
            status: "In The Kitchen",
          },
          $push: {
            orderStatus: {
              name: "In The Kitchen",
              time: new Date(),
              message: "Chef is preparing your meal",
            },
          },
        },
        {
          arrayFilters: [{ "item.dishStatus": "Approved" }], // Filter array elements to only update those with "Order-Placed" status
          new: true,
        }
      );
    }else{
      result = await orderModel.findOneAndUpdate(
        {
          _id: orderID,
          "Items.dishStatus": "Approved", // Match orders with at least one item with "Order-Placed" status
        },
        {
          $set: {
            "Items.$[item].dishStatus": "Processing", // Update all items with "Order-Placed" status to "Approved"
            status: "In The Kitchen",
          },
        },
        {
          arrayFilters: [{ "item.dishStatus": "Approved" }], // Filter array elements to only update those with "Order-Placed" status
          new: true,
        }
      );
    }

    
    res.status(200).send(result);

  } catch (error) {
    responseError(res, 500, error);
  }
};

const ProcessingOrderListForKitchenStaff = async (req, res) => {
  try {
    const {
      typeOfRange,
      startingDate,
      endingDate,
      currentPage,
      numberOfSizeInTableData,
      search,
    } = req.query;
    const { res_id, branchID } = req.params;

    let selectData = "-__v -OTP -shippingCharge";

    const filter = {
      res_id: res_id,
      branchID: branchID,
      status:{ $in: ["Processing", "In The Kitchen"] },
    };

    // if (req.role === "Delivery Man") {
    //     filter["deliveryPartner._id"] = req.adminID;
    //     selectData = '-__v -OTP -shippingCharge -order_item -address';
    // }

    if (typeOfRange === "Last 7 Days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filter.createdAt = { $gte: sevenDaysAgo };
    } else if (typeOfRange === "Last 30 Days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filter.createdAt = { $gte: thirtyDaysAgo };
    } else if (typeOfRange === "Custom" && startingDate && endingDate) {
      // If Custom range selected, check the startDate and endingDate
      const endDate = new Date(endingDate);
      endDate.setHours(23, 59, 59); // Set the time to the end of the day
      filter.createdAt = {
        $gte: new Date(startingDate),
        $lte: endDate,
      };
    }

    if (search) {
      filter.$or = [
        { phone: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } },
        { cash_status: { $regex: search, $options: "i" } },
      ];
    }
    const page = parseInt(currentPage) || 0;
    const size = parseInt(numberOfSizeInTableData) || 15;
    const skipCount = page * size;

    const [arrayData, totalCount] = await Promise.all([
      orderModel
        .find(filter)
        .select(selectData)
        .sort({ updatedAt: -1 })
        .skip(skipCount)
        .limit(size)
        .populate("user_id"),
      orderModel.countDocuments(filter),
    ]);

    if (!arrayData || arrayData.length === 0) {
      return res.status(200).send({ DataArrayList: [], count: 0 });
    }
    const branchData = await branchModel
      .findById(branchID)
      .select("paymentTypes");

    res
      .status(200)
      .json({
        DataArrayList: arrayData,
        count: totalCount,
        paymentTypes: branchData?.paymentTypes,
      });
  } catch (error) {
    console.error("Error while fetching orders", error);
    res.status(500).json({ message: "Server error" });
  }
};

const Onsite_Order_Update_Status_for_completed = async (req,res) =>{
  try {
    const {orderID} =  req.params;
    const order_data = await orderModel.findById(orderID);
    if(order_data?.order_from == "OFFSITE" && order_data?.orderNote == "Take-away"){
      const result = await orderModel.findByIdAndUpdate(
        orderID,
        {
          $set: {
            "Items.$[].dishStatus": "Delivered",
            status: "Delivered",
          },
          $push: {
            orderStatus: {
              name: "Delivered",
              time: new Date().toISOString(),
              message: "Food is Delivered !",
            },
          },

        }, // Update the dishStatus of all items
        { new: true }
      );
      if(!result){
        responseError(res,400,"No Order Found!");
        }else{
          res.status(200).json(result);
        }
    }else{
      const result = await orderModel.findByIdAndUpdate(
        orderID,
        {
          $set: {
            "Items.$[].dishStatus": "Delivered",
            status: "Delivered",
          }
        }, // Update the dishStatus of all items
        { new: true }
      );
      if(!result){
        responseError(res,400,"No Order Found!");
        }else{
          res.status(200).json(result);
        }
    }
   
  } catch (error) {
    responseError(res,500,"Internal Server Error");
  }
}


const AllOrderList_For_DeliveryPartner = async (req,res)=> {
  try {
    const {
      typeOfRange,
      startingDate,
      endingDate,
      currentPage,
      numberOfSizeInTableData,
      search,
    } = req.query;
    const { res_id, branchID,_id } = req.params;
    const employee = await employeeModel.findById( _id );
    if( !employee ) {
      return responseError(res, 401, 'Invalid');
    }

    try {
      
  
      let selectData = "-__v -OTP -shippingCharge";
  
      const filter = {
        res_id: res_id,
        branchID: branchID,
        "deliveryPartner.Employee_id": employee?._id,
      };
  
      // if (req.role === "Delivery Man") {
      //     filter["deliveryPartner._id"] = req.adminID;
      //     selectData = '-__v -OTP -shippingCharge -order_item -address';
      // }
  
      if (typeOfRange === "Last 7 Days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filter.createdAt = { $gte: sevenDaysAgo };
      } else if (typeOfRange === "Last 30 Days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filter.createdAt = { $gte: thirtyDaysAgo };
      } else if (typeOfRange === "Custom" && startingDate && endingDate) {
        // If Custom range selected, check the startDate and endingDate
        const endDate = new Date(endingDate);
        endDate.setHours(23, 59, 59); // Set the time to the end of the day
        filter.createdAt = {
          $gte: new Date(startingDate),
          $lte: endDate,
        };
      }
  
      if (search) {
        filter.$or = [
          { phone: { $regex: search, $options: "i" } },
          { status: { $regex: search, $options: "i" } },
          { cash_status: { $regex: search, $options: "i" } },
        ];
      }
      const page = parseInt(currentPage) || 0;
      const size = parseInt(numberOfSizeInTableData) || 15;
      const skipCount = page * size;
  
      const [arrayData, totalCount] = await Promise.all([
        orderModel
          .find(filter)
          .select(selectData)
          .sort({ createdAt: -1 })
          .skip(skipCount)
          .limit(size)
          .populate("user_id"),
        orderModel.countDocuments(filter),
      ]);
  
      if (!arrayData || arrayData.length === 0) {
        return res.status(200).send({ DataArrayList: [], count: 0 });
      }
     
  
      res
        .status(200)
        .json({
          DataArrayList: arrayData,
          count: totalCount,
        });
    } catch (error) {
      console.error("Error while fetching orders", error);
      res.status(500).json({ message: "Server error" });
    }
  } catch (error) {
    responseError(res, 500, error);
  }
}
const generateOTP = () => {
  const characters = "0123456789";
  return Array.from(
    { length: 4 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};
const handleProceedTOReadyToDelivery = async (req,res)=>{
  try {
    const {orderID} = req.params;
    // Generate a new OTP
    const OTP = generateOTP();

    const order = await orderModel.findById(orderID).populate("branchID res_id");


    const phone = order?.phone;
    let cleanedNumber = phone.replace(/^\+88/, '');

  
    let message = `Your OTP for the order at ${order?.res_id?.res_name || ''} ${order?.branchID?.branch_name || ''} is: ${OTP}%0A%0ADelivery partner: ${order?.deliveryPartner?.name || ''}%0APhone: ${order?.deliveryPartner?.phone || ''} %0AEnjoy your meal!`;

    await orderModel.findByIdAndUpdate(order._id,
      {$set:{status:"Ready To Delivery",
      OTP:OTP},
      $push:{orderStatus:{name : "Ready To Delivery" , 
      message: `Order is Ready to delivery`,
      time: new  Date().toISOString()
    }}
    
    },{new:true});
    const smsResponse = await axios.post(
      `https://bulksmsbd.net/api/smsapi?api_key=${process.env.BULK_MESSAGE_API}&type=text&number=${cleanedNumber}&senderid=${process.env.BULK_MESSAGE_SENDER}&message=${message}`
    );
    
    console.log(smsResponse.data); 
    res.status(200).send(true);
  } catch (error) {
    responseError(res, 500, error);
  }
}

const  verifyOtpAndCompleteOrder = async (req,res)=> {
  try{ 
   const {orderID}=req.params;
   const {otp}=req.body;
   const order=await orderModel.findById(orderID);
   console.log(otp,order)
   
    if(!order || otp !== order?.OTP){
      return responseError(res,400,{},"OTP mismatched please try again")
    };
    await orderModel.findByIdAndUpdate(order._id,
     {$set:{
       "Items.$[].dishStatus": "Delivered",
       status:"Delivered",
     },
     $push:{orderStatus:{name : "Delivered" , 
     message: "Order is delivered to customer successfully",
     time: new  Date().toISOString()
     }}},{new:true});
 
 res.status(200).send(true);
 }catch(error){
   responseError(res,500,"Internal Server Error");
 }
 }

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
  adminPlaceOrder,
  AllOrderList,
  OngoingOrderList, //for admin
  updateOrderSingleItem,
  dataForPayment,
  updateOrderByIdForPayment,
  UpdateOrder_ReceivedMoney_PayFirst_branches_Onsite_Order,
  UpdateOrder_ReceivedMoney_PayLast_branches_Onsite_Order,
  approveDishItem, //admin approve dish item placed to approved for cook
  order_Prepared_and_ready_to_serve_By_KOT_Approval,
  order_Is_being_Prepared_By_KOT_Approval,
  ProcessingOrderListForKitchenStaff,
  Onsite_Order_Update_Status_for_completed,
  AllOrderList_For_DeliveryPartner,
  handleProceedTOReadyToDelivery,
  verifyOtpAndCompleteOrder
};
