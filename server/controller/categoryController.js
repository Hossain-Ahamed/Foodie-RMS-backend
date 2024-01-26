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


// Read operation
const getCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// Update operation
const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const dataToUpdate = req.body;

        const category = await categoryModel.findByIdAndUpdate(
            categoryId,
            { $set: dataToUpdate },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};

// Delete operation
const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await categoryModel.findByIdAndDelete(categoryId);

        if (!category) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        res.status(200).json({ msg: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};
