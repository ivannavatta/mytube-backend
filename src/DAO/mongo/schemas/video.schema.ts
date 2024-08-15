import mongoose from "mongoose";
const { ObjectId } = mongoose.Types

const videoSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: 'user'
    },
    videos: {
        type: [
            {
                originalName: String,
                title: String,
                size: Number,
                isPrivate: {
                    type: Boolean,
                    default: false
                },
                url: String,
                urlGCS: String,
                status: {
                    type: Boolean,
                    default: true
                  },
            
            }
        ]
    },
    
    createdAt: {
        type: Date,
        default: Date.now
      },
    updatedAt: {
        type: Date,
        default: Date.now
      }
})


export default videoSchema