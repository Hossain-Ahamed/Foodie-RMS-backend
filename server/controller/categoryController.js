const categoryModel = require("../model/categoryModel");

const addCategory = async (req,res)=>{
    try{
        const {category_name,img,category_slug,isActive,shortdescription} = req.body;
        if(!category_name || !img ||!category_slug){
            return res.status(400).json({msg:"Please fill all fields"});
            }else{
                let catExist = await categoryModel.findOne({category_slug:category_slug
                    });
                    if(catExist)
                    {
                        return  res.status(409).json({msg:`${category_slug
                            } already exists`})
                            }else{
                                const newCat = new categoryModel({
                                    category_name,
                                    img,
                                    category_slug,
                                    isActive,
                                    shortdescription
                                    })
                                    const result = await newCat.save();
                                    // console.log(result);
                                    res.status(201).json(result);
                                    }
                                    }
                                }
                                    catch(err){
                                        console.log(err);
                                        res.status(500).json({msg:'Internal Server Error'});
                                        }
    

}

const allCategory = async (req,res)=>{
    try {
        const categories=await categoryModel.find();
        // console.log(categories);
        res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({ msg: 'Server error' });
            }
    
}

const updateCategory = async (req,res)=>{
    
}
