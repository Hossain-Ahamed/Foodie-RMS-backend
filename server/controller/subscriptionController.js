const Subscription = require("../model/subscriptionModel");



// This is your test secret API key.
const stripe = require("stripe")(process.env.PK_KEY);   

// payment gateway 
const CreatePaymentIntent = async (req, res) => {
    try {
        const { price } = req.body;

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
        console.log(e);
        // Bad Request: Server error or client sent an invalid request
        res.status(500).send({ message: "Bad Request: Server error or invalid request" });
    }
};

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
    const { res_id, branchID, packageType } = req.body;
    let startDate = Date.now();
    let endDate;
    switch (packageType) {
      case "3 month":
        endDate = startDate + 3 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "6 month":
        endDate = startDate + 6 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "12 month":
        endDate = startDate + 12 * 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        return res.status(400).json({ error: "Invalid package type" });
    }

    const newSubscription = new Subscription({
      res_id,
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
        },
      ],
    }).save();
    res.status(201).send(true);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//when user expend their subscription
const extendSubscription = async (req, res) => {
  try {
    const { subscriptionId, packageType } = req.body;

    const existingSubscription = await Subscription.findById(subscriptionId);
    if (!existingSubscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    let newEndDate;
    switch (packageType) {
      case "3 month":
        newEndDate =
          existingSubscription.endDate + 3 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "6 month":
        newEndDate =
          existingSubscription.endDate + 6 * 30 * 24 * 60 * 60 * 1000;
        break;
      case "12 month":
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
};
