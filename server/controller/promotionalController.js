const Story = require("../model/storiesModel");
const Short = require("../model/shortVideoModel");
const Branch = require("../model/branchModel");

const storyView = async(req,res)=>{
    try {
        const {city} = req.body;
        const branches = await Branch.find({ city });
        const branchIds = branches.map(branch => branch._id);
        const uniqueSet = new Set(branchIds);
        const branchArray = [...uniqueSet];
        const imgArrays = [];
        for(const branchId of branchArray){
            const stories = await Story.find({branchID: branchId});
            const imgs = stories.map(story => story.img);
            imgArrays.push(imgs);
        }
        res.send(200).json(imgArrays);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "Failed" });
    }
}

const shortView = async(req,res)=>{
    try {
        const {city} = req.body;
        const branches = await Branch.find({ city });
        const branchIds = branches.map(branch => branch._id);
        const uniqueSet = new Set(branchIds);
        const branchArray = [...uniqueSet];
        const videoArrays = [];
        for(const branchId of branchArray){
            const shorts = await Short.find({branchID: branchId});
            const short = shorts.map(s => s);
            videoArrays.push(short);
        }
        res.send(200).json(videoArrays);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "Failed" });
    }
}