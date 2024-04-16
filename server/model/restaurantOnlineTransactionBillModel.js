const mongoose = require( 'mongoose' );

const restaurantOnlineBillSchema = new mongoose.Schema(
    {
        res_id: {
            type: mongoose.ObjectId,
            ref: "Restaurants",
          },
          branchID: {
            type: mongoose.ObjectId,
            ref: "Branches",
          },
          month:{
            type : String , 
          },
          year:{
            type : Number ,
          },
          NeedToPay:{
            type:Number,
            default:0
          },
          paid:{
            type:Number,
            default:0
          },
          billHistory:[{
            orderID:{
                type: mongoose.ObjectId,
                ref: "order",
            },
            transactionID:{
                type:String
            },
            intent_methodID:{
                type:String
            },
            methodID:{
                type:String
            },
            price:{
                type:Number
            }
          
        }],
        paidToRestaurant:[
            {
                ammount:{
                    type:Number
                },
                date:{
                    type:Date,
                    default:Date.now()
                }
            }
        ]
    }, 
    { timestamps: true }
  );
  
  module.exports = mongoose.model("restaurantOnlineTransactionBill", restaurantOnlineBillSchema)