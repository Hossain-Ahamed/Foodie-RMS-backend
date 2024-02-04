const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  res_id: {
    type: mongoose.ObjectId,
    ref: "Restaurants",
    required: true,
  },
  branchID: {
	type: mongoose.ObjectId,
	ref: "Branchs",
	required: true,
  },
  user_id: {
	 type: mongoose.ObjectId, 
	 ref: "users", 
	 required: true },

  status: { 
	type: String 
},
  totalAmount: { 
	type: String 
},
  orderItems: [
    {
      dishID: { 
		type: mongoose.ObjectId, 
	 ref: "dishes", 
	 required: true 
	},
      dishQuantity: { 
		type: String 
	},
      dishTotalPrice: { 
		type: Number 
	},
    },
  ],
  addOn: [
	{
	  name: {
		type: String,
		required: true,
	  },
	  price: {
		type: Number,
		required: true,
	  }
	},
  ],
  orderNote: { 
	type: String 
},
discount:{
	type:String,
},
vouchar:{
	type:String,
},

 
});

module.exports = mongoose.model("order", orderSchema);
