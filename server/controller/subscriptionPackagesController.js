const subscriptionPackagesModel = require("../model/subcripstionPackages");

const  getAllSubscriptionPackage = (req, res) => {
    try{
        const  data= subscriptionPackagesModel.find();
        return res.status(200).send(data);

    }catch(e){
        console.log('Error in getting all Subscription Packages', e);
        return res.status(500).json({"error": "Internal Server Error"});
    }
}

const  addNewSubscriptionPackage = async (req,res)=>{
    const {packageType,shortDescription,finalPrice,cutPrice} = req.body;
    if(!packageType || !shortDescription||!finalPrice||!cutPrice){
        return res.status(400).json({"error":"Please provide complete details."})
    }else{
         let packageExist = await subscriptionPackagesModel.findOne({packageType:packageType});
          if(packageExist){
              return res.status(409).json({"error":"This Package is already exist."})
          } else{
            const newPackage = new subscriptionPackagesModel({
                packageType:packageType,
                shortDescription:shortDescription,
                finalPrice:finalPrice,
                cutPrice:cutPrice
             });
             try{
                 const savePackage = await newPackage.save();
                 return res.status(201).send(savePackage);
             } catch(e){
                 console.log('Error in adding New Subscription Package', e);
                 return res.status(500).json({"error": "Internal Server Error"});
                 }     
           }    
     }
}
const updateSubscriptionPackage = async (req, res) => {
    try{
        const id = req.params.id;
        const {packageType,shortDescription,finalPrice,cutPrice} = req.body;
        const updatedPackage = await subscriptionPackagesModel.findByIdAndUpdate(id,{
            packageType : packageType ? packageType : null,
            shortDescription : shortDescription ? shortDescription : null,
            finalPrice : finalPrice ? finalPrice : null,
            cutPrice : cutPrice ? cutPrice : null
        },{new:true}).exec(); //return the updated document not the original one
        return res.status(200).send(updatedPackage);
    }catch(e){  
        return res.status(400).json({"error": "Bad Request"});
    }
}


module.exports={getAllSubscriptionPackage,addNewSubscriptionPackage,updateSubscriptionPackage};
