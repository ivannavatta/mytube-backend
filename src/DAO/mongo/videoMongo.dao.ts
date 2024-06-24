
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

   public async delete(id: string){
        return await Video.updateOne({_id: id})
    }
    
}

export default VideoMongoDao