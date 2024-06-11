import mongoose from "mongoose";
import videoSchema from "../schemas/video.schema";

const videoCollection = 'video'

const Video = mongoose.model(videoCollection, videoSchema)

export default Video