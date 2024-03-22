const printingModel = require("../model/printingSetUpModel");
const restaurant = require("../model/restaurantModel");
const branch = require("../model/branchModel");

const showPrintingSetUp = async (req, res) => {
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
  console.log(req.body);
  try {
    // const res_data = await restaurant
    //   .findById({ _id: res_id })
    //   .select("res_name,img,res_mobile,res_email")
    //   .lean();
    // const branch_data = await branch
    //   .findById({ _id: branchID })
    //   .select("branch_name,streetAddress,city,stateProvince,postalCode")
    //   .lean();
    // let streetAddress,
    //   city,
    //   stateProvince,
    //   postalCode,
    //   res_email,
    //   res_mobile,
    //   img;
    // if (print_res_email) {
    //   res_email = res_data.res_email;
    // }
    // if (print_res_mobile) {
    //   res_mobile = res_data.res_mobile;
    // }
    // if (print_address) {
    //   streetAddress = branch_data.streetAddress;
    //   city = branch_data.city;
    //   stateProvince = branch_data.stateProvince;
    //   postalCode = branch_data.postalCode;
    // }
    // if (print_logo) {
    //   img = res_data.img;
    // }


    
    // res.status(200).send({
    //                 res_name:res_data.res_name,
    //                 headerText:headerText,
    //                 greetingText:greetingText,
    //                 streetAddress: streetAddress,
    //                 city:city,
    //                 stateProvince:stateProvince,
    //                 postalCode: postalCode,
    //                 img:img,
    //                 res_email:res_email,
    //                 res_mobile:res_mobile,
    //                 print_address:print_address,
    //                 print_logo:print_logo,
    //                 print_res_email:print_res_email

    //   });
  const update =  await printingModel.findOneAndUpdate({branchID:branchID},{
      print_res_email,
    print_res_mobile,
    print_address,
    print_logo,
    print_kitchen_print,
    headerText,
    greetingText,
    },{new:true});
    console.log('update',update);
    res.status(200).send(true);
  } catch (e) {
    console.log("error in catch", e);
  }
};

const getPrintingSetUp = async (req,res)=>{
    const { res_id, branchID } = req.params;
    console.log(branchID)
try {
    const branch1 = await branch.findOne({_id:branchID});
    // console.log(branch1)
    const checkPrint = await printingModel.findOne({branchID:branchID});
    //console.log(checkPrint)
    let response = {};
    if(!checkPrint && branch1){
        const printing = await printingModel({
            branchID : branch1._id ,
            headerText:"Welcome",
            greetingText:"Thank you!",
          }).save();
          // console.log(printing)
          response = {...response, ...printing._doc};
    }else{
     // console.log("checkPrint")
      response = {...response, ...checkPrint._doc}
    }
    const res_data = await restaurant
      .findById({ _id: res_id })
      .select("res_name , img , res_mobile , res_email")
      .lean();
      //console.log("res data",res_data)
    response = {
      ...response,res_name:res_data?.res_name,
                    streetAddress: branch1?.streetAddress,
                    city:branch1?.city,
                    stateProvince:branch1?.stateProvince,
                    postalCode: branch1?.postalCode,
                    img: res_data?.img,
                    res_email:res_data?.res_email,
                    res_mobile:res_data?.res_mobile,
                    branch_name:branch1?.branch_name
                
}
//console.log(response);
res.status(200).send(response);
} catch (error) {
  console.log(error);
    res.status(500).send("internal server error");
}
}

module.exports={
    getPrintingSetUp,
    showPrintingSetUp

};