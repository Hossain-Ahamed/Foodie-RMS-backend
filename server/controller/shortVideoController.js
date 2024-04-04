const video = require("../model/shortVideoModel");

const createVideo = async (req, res) => {
  try {
    const { res_id, branchID } = req.params;
    const { videoFile, likeCount, dislikeCount } = req.body;
    await video({
      res_id,
      branchID,
      videoFile,
      likeCount: parseInt(likeCount) || 0,
      dislikeCount: parseInt(dislikeCount) || 0,
    }).save();
    res.status(201).send(true);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteVideoById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedVideo = await video.findByIdAndDelete(id);
    if (!deletedVideo) {
      return res.status(404).json({ message: "video not found" });
    }
    res.status(200).json({ message: "video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getStoriesByBranchID = async (req, res) => {
  const { branchID } = req.params;
  try {
    const videos = await video.find({ branchID });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createVideo, deleteVideoById, getStoriesByBranchID };
