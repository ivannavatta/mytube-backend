import mongoose from "mongoose";
const { ObjectId } = mongoose.Types

const videoSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'user'
    },
    title: String,
    url: String
})

export default videoSchema