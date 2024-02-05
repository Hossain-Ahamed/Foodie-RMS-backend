const Subscription = require("../model/subscriptionModel");

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
    existingSubscription.endDate = newEndDate;
    existingSubscription.packageType = packageType;
    existingSubscription.updatedAt = Date.now();
    previousSubscriptionsDetails = {
      packageType: packageType,
      startDate: existingSubscription.endDate,
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
