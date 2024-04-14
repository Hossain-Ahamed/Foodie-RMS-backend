const Recipe = require("../model/recipeModel");
const Dish = require("../model/recipeModel");

const dishName = async (req, res) => {
  try {
    const id = req.params;
    const name = await Dish.findById(id);
    res.status(200).send(name);
  } catch (error) {
    res.status(500).json({
      message: "error occured while creating",
    });
  }
};

const createRecipe = async (req, res) => {
  try {
    const { res_id, branchID, dishId } = req.params;
    const { dish, ingredients } = req.body;
    const newRecipe = new Recipe({
      res_id,
      branchID,
      dish,
      dishId,
      ingredients,
    });
    const savedRecipe = await newRecipe.save();

    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(500).json({ error: "Could not create recipe" });
  }
};
module.exports = {
  dishName,
  createRecipe,
};
