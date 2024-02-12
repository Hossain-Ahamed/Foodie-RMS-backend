const Subscription = require("../model/subscriptionModel");
const branchModel = require("../model/branchModel");
const { createUserAccount } = require("../config/firbase-config.js");
const restaurantModel = require("../model/restaurantModel");
const packageModel = require("../model/subcripstionPackages");
const createClient = require("./clientController.js");
const sendMail = require("../utils/sendEmail.js");
const uuid = require("uuid");
// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51NxHA3BTo76s02AIpHmn0d0gRVmFKqznGxcwKiHQ1eslceVjz5cQC7jKn3a8GnsQ0IoDhxNGZoRZPDXKEzYQQErN00aE7u24Le"
);

// payment gateway
const CreatePaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    // console.log(price, process.env.PK_KEY);
    const ammount = parseInt(price * 100);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ammount,
      currency: "usd",

      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    // console.log(1, e);
    // Bad Request: Server error or client sent an invalid request
    res
      .status(500)
      .send({ message: "Bad Request: Server error or invalid request" });
  }
};

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
    const { res_id, packageType } = req.body;
    const { branchID } = req.params;
    let startDate = Date.now();
    const existingSubscription = await Subscription.findOne({
      branchID: branchID,
    });
    if (existingSubscription) {
      return res.status(400).json({ error: "Subscription already exist" });
    }
    let endDate;
    switch (packageType) {
      case "Starter":
        endDate = startDate + 3 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "Pro":
        endDate = startDate + 6 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "Enterprise":
        endDate = startDate + 12 * 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        return res.status(400).json({ error: "Invalid package type" });
    }
    const res_Id_needed = await branchModel.findOne({ _id: branchID });

    const newSubscription = new Subscription({
      res_id: res_Id_needed.res_id,
      branchID,
      packageType,
      startDate,
      endDate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      previousSubscriptions: [
        {
          packageType: packageType,
          startDate: startDate,
          endDate: endDate,
          payment_time: 0,
          price: 0,
          transactionID: "0000000000000000000",
        },
      ],
    }).save();
    res.status(201).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//give subscription payment Details

const getPaymentDetails = async (req, res) => {
  try {
    const { branchID } = req.params;
    const existingSubscription = await Subscription.findOne({
      branchID: branchID,
    });
    const packages = await packageModel.findOne({
      packageType: existingSubscription.packageType,
    });
    if (!existingSubscription) {
      return res.status(404).json({ error: "No such Branch ID" });
    }
    const Data = {
      Details: {
        _id: existingSubscription._id,
        res_id: existingSubscription.res_id,
        branchID: existingSubscription.branchID,
        packageType: existingSubscription.packageType,
      },
      price: parseFloat(packages.finalPrice),
    };
    res.status(200).json(Data);
  } catch (error) {
    console.log("Error in getting Payment details", error);
  }
};

//update packages data after payment

const updatePackageAfterPayment = async (req, res) => {
  const { subscriptionID, packageType, transactionID, price } = req.body;
  const existingSubscription = await Subscription.findById(subscriptionID);
  if (!existingSubscription) {
    return res.status(404).json({ error: "Subscription not found" });
  }
  let startdate = Date.now();
  let enddate;
  switch (packageType) {
    case "Starter":
      enddate = startdate + 3 * 30 * 24 * 60 * 60 * 1000;
      break;
    case "Pro":
      enddate = startdate + 6 * 30 * 24 * 60 * 60 * 1000;
      break;
    case "Enterprise":
      enddate = startdate + 12 * 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      return res.status(400).json({ error: "Invalid package type" });
  }
  // existingSubscription.startDate = startdate;
  // existingSubscription.endDate = enddate;
  // existingSubscription.isActive = true;
  // existingSubscription.previousSubscriptions[0].startDate = startdate;
  // existingSubscription.previousSubscriptions[0].endDate = enddate;
  // existingSubscription.previousSubscriptions[0].price = price;
  // existingSubscription.previousSubscriptions[0].transactionID = transactionID;
  // existingSubscription.previousSubscriptions[0].paymentStatus = true;
  const subscriptionUpdate = await Subscription.findByIdAndUpdate(
    subscriptionID,
    {
      startDate: startdate,
      endDate: enddate,
      isActive: true,
      previousSubscriptions: [
        {
          startDate: startdate,
          endDate: enddate,
          payment_time: Date.now(),
          price: price,
          paymentStatus: true,
          transactionID: transactionID,
        },
      ],
    }
  );
  const existingRestaurant = await restaurantModel.findById(
    existingSubscription.res_id
  );
  if (!existingRestaurant) {
    return res.status(404).json({ error: "Restaurant not found" });
  }
  const password = uuid.v4().slice(0,8);
  const email = existingRestaurant.res_Owner_email;
  const name = existingRestaurant.res_Owner_Name;

  createUserAccount({ name,email, password })
  .then(res=>{
         console.log(res?.uid)
  })
  .catch(e=>console.log(e));
  createClient({ email, password });
};

//when user expend their subscription
const extendSubscription = async (req, res) => {
  try {
    const { subscriptionID, packageType, transactionID, price } = req.body;

    const existingSubscription = await Subscription.findById(subscriptionID);
    if (!existingSubscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    let newEndDate;
    switch (packageType) {
      case "Starter":
        newEndDate =
          existingSubscription.endDate + 3 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "Pro":
        newEndDate =
          existingSubscription.endDate + 6 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "Enterprise":
        newEndDate =
          existingSubscription.endDate + 12 * 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        return res.status(400).json({ error: "Invalid package type" });
    }
    let secondaryEndDate = existingSubscription.endDate;
    existingSubscription.endDate = newEndDate;
    existingSubscription.packageType = packageType;
    existingSubscription.updatedAt = Date.now();
    previousSubscriptionsDetails = {
      packageType: packageType,
      startDate: secondaryEndDate,
      endDate: newEndDate,
      payment_time: Date.now(),
      price: price,
      paymentStatus: true,
      transactionID: transactionID,
    };
    existingSubscription.previousSubscriptions.push(
      previousSubscriptionsDetails
    );
    await existingSubscription.save();
    res.status(200).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createSubscription,
  extendSubscription,
  CreatePaymentIntent,
  getPaymentDetails,
  updatePackageAfterPayment,
};
