const stories = require("../model/storiesModel");

const createStories = async (req, res) => {
  try {
    const { res_id, branchID } = req.params;
    const { img } = req.body;
    const newStory = await stories({
      res_id,
      branchID,
      img,
      created_date: Date.now(),
      remove_date: Date.now() + 24 * 60 * 60 * 1000,
    }).save();
    return res.status(201).json(newStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStoryByID = async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const story = await stories.findById(_id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    await story.deleteOne();
    return res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const allStoriesByBranch = async (req, res) => {
  try {
    const { branchID } = req.params;
    const Stories = await stories
      .find({ branchID: branchID })
      .sort({ created_date: -1 });
    return res.status(200).send(Stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStories,
  deleteStoryByID,
  allStoriesByBranch,
};
