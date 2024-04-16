const Story = require("../model/storiesModel");
const Short = require("../model/shortVideoModel");
const Branch = require("../model/branchModel");

const storyView = async (req, res) => {
    try {
        const { city } = req.params;
        const branches = await Branch.find({ city: city }).populate('res_id');
        const branchIds = branches.map(branch => branch._id);
        const branchImgs = branches.map(branch => branch.res_id.img);
        const uniqueSet = new Set(branchIds);
        const branchArray = [...uniqueSet];
        let imgArrays = [];
        for (const branchId of branchArray) {
            const stories = await Story.find({ branchID: branchId });
            const imgs = stories.map(story => story.img);
            for(const branchImg of branchImgs){
                const c = {
                    branchimg: branchImg,
                    Imgs: imgs
                }
            }
            imgArrays.push(c);
        }
        const b = {
            stories: imgArrays,
            restaurants: branches,
        }
        res.status(200).json(b);
    } catch (error) {
        console.error("Error: ", error);
        res.status(500).json({ error: "Failed" });
    }
}

const shortView = async (req, res) => {
    try {
        const branches = await Branch.find();
        const branchIds = branches.map(branch => branch._id);
        const uniqueSet = new Set(branchIds);
        const branchArray = [...uniqueSet];
        let videoArrays = [];
        for (const branchId of branchArray) {
            const shorts = await Short.find({ branchID: branchId }).populate('res_id branchID');
            for (const short of shorts) {
                let { _id, videoFile, likeCount, dislikeCount, res_id, branchID } = short
                const reelInfo = {
                    url: videoFile,
                    type: 'video/mp4',
                    description: `#Foddie #${res_id.res_name}`,
                    postedBy: {
                        avatar: res_id.img,
                        name: res_id.res_name,
                    },
                    likes: {
                        count: likeCount || 0
                    },
                    dislikes: {
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
const updateLikeCount = async (req, res) => {
    try {
        const { id } = req.params;
        const shortVideo = await Short.findById(id);
        if (!shortVideo) {
            return res.status(404).json({ message: 'Short video not found' });
        }
        shortVideo.likeCount++;
        await shortVideo.save();
        res.status(200).json({ message: 'Like count updated successfully' });
    } catch (error) {
        console.error('Error updating like count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const updateDislikeCount = async (req, res) => {
    try {
        const { id } = req.params;
        const shortVideo = await Short.findById(id);
        if (!shortVideo) {
            return res.status(404).json({ message: 'Short video not found' });
        }
        shortVideo.dislikeCount++;
        await shortVideo.save();
        res.status(200).json({ message: 'Dislike count updated successfully' });
    } catch (error) {
        console.error('Error updating dislike count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
module.exports = { shortView, storyView, updateLikeCount, updateDislikeCount }