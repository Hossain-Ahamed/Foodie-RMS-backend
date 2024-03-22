const printingModel = require("../model/printingSetUpModel");
const restaurant = require("../model/restaurantModel");
const branch = require("../model/branchModel");

const createPrintingSetUp = async (req, res) => {
  const { res_id, branchID } = req.params;
  const {
    print_res_email,
    print_res_mobile,
    print_address,
    print_logo,
    print_kitchen_print,
    headerText,
    greetingText,
  } = req.body;
  try {
    const res_data = await restaurant
      .findById({ _id: res_id })
      .select("res_name,img,res_mobile,res_email")
      .lean();
    const branch_data = await branch
      .getBranchByID({ _id: branchID })
      .select("branch_name,streetAddress,city,stateProvince,postalCode")
      .lean();
    let streetAddress,
      city,
      stateProvince,
      postalCode,
      res_email,
      res_mobile,
      img;
    if (print_res_email) {
      res_email = res_data.res_email;
    }
    if (print_res_mobile) {
      res_mobile = res_data.res_mobile;
    }
    if (print_address) {
      streetAddress = branch_data.streetAddress;
      city = branch_data.city;
      stateProvince = branch_data.stateProvince;
      postalCode = branch_data.postalCode;
    }
    if (print_logo) {
      img = res_data.img;
    }


    
    res.status(200).send({
                    res_name:res_data.res_name,
                    headerText:headerText,
                    greetingText:greetingText,
                    streetAddress: streetAddress,
                    city:city,
                    stateProvince:stateProvince,
                    postalCode: postalCode,
                    img:img,
                    res_email:res_email,
                    res_mobile:res_mobile,

      });
  } catch (e) {
    console.log("error in catch", e);
  }
};

const getPrintingSetUp = async(req,res)=>{
    const { res_id, branchID } = req.params;
try {
    const branch = branch.findOne({_id:branchID});
    const checkPrint = printingModel.findOne({branchID:branchID});
    if(!checkPrint && branch){
        const printing = await printingModel({
            branchID : branch._id ,
            headerText:"Welcome",
            greetingText:"Thank you!",
          }).save();
          res.status(200).send(printing);
    }else{
        res.status(400).send(checkPrint);
    }
} catch (error) {
    res.status(500).send("internal server error");
}
}

module.exports={
    getPrintingSetUp,
    createPrintingSetUp

};