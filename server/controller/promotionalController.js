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
        let imgArrays = [];
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
        const branches = await Branch.find();
        const branchIds = branches.map(branch => branch._id);
        const uniqueSet = new Set(branchIds);
        const branchArray = [...uniqueSet];
        let videoArrays = [];
        for(const branchId of branchArray){
            const shorts = await Short.find({branchID: branchId}).populate('res_id branchID');
            for(const short of shorts){
                let {_id, videoFile, likeCount,dislikeCount, res_id, branchID} = short
                const reelInfo ={
                    url: videoFile,
                    type:'video/mp4',
                    description:`#Foddie #${res_id.res_name}`,
                    postedBy:{
                        avatar: res_id.img,
                        name: res_id.res_name,
                    },
                    likes:{
                        count: likeCount || 0
                    },
                    dislikes:{
                        count: dislikeCount || 0
                    }
                };
                const a = {
                    id: _id,
                    reelInfo,
                }
                videoArrays.push(a);
            }
        }
        res.status(200).json(videoArrays);
    } catch (error) {
      console.error("Error: ", error);
      res.status(500).json({ error: "Failed" });
    }
}

module.exports = {shortView,storyView}