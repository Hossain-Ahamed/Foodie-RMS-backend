const tablemodel = require("../model/tableModel");

const CreateTable = async(req,res)=>{
    try {
        const {res_id,branchID,number,capacity} = req.body;
        if(!res_id ||  !branchID){
            return res.status(400).json({msg:"Please provide all fields"});
        }else{ 
            const table = await tablemodel(
                {res_id,
                    branchID,
                    number,
                    capacity}).save() ;
                    // console.log(table);
                    res.status(201).json(table)

        }
    } catch (error) {
        res.status(500).json({ msg: "Server Error!" });
        
    }
}

const Updatetable = async (req,res)=>{
    const { id }= req.params;
    const {res_id,branchID,number,capacity} = req.body;
    
    try {
        const table =await tablemodel.findByIdAndUpdate(id ,{res_id,branchID,number,capacity},{new:true} )
        .then(()=>{
           return res.status(200).json('The Table has been updated')   
        })
        .catch((err)=>console.log(err))
      
    } catch (error) {
        res.status(500).json({ msg: "Server Error!"+ error})
    }
}

const Alltable = async(req,res)=>{
    try {
        const alldata = await tablemodel.find();
        res.status(200).json(alldata)
    } catch (error) {
        res.status(500).json({ msg: 'Error!' + error })
    }
}

module.exports={
    CreateTable,
    Updatetable,
    Alltable
}