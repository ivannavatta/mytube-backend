
import { Types } from "mongoose";
import { IStore } from "../../entities/store.entiti";
import Video from "./models/video.model";

class VideoMongoDao implements IStore {
    public async getAll(){
        return await Video.find()
    }

   public async create(params: object){
        return await Video.create(params)
    }

   public async find(id: Types.ObjectId){
        return await Video.findOne({user: id})
    }

   public async update(id: string, params: any){
        return await Video.updateOne({_id: id}, params)
    }

   public async delete(id: string, videoId: string){
        const video = await Video.findById(id) 
        if(video){
            const videoIndex = video.videos.findIndex(videoExist => videoExist?._id?.toString() === videoId.toString())

            if(videoIndex === 0){
                video.videos[videoIndex].status = false
                video.updatedAt = new Date()
                await video.save()
            }
            else{
                throw new Error('the user video does not exist')
            }
        }
        else{
            throw new Error('the video does not exist')
        }
    }
 
}
    


export default VideoMongoDao