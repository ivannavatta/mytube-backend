import { Types } from "mongoose"
import VideoMongoDao from "../DAO/mongo/videoMongo.dao"
import { IStore } from "../entities/store.entiti"

class VideoStore implements IStore {
   private dao: VideoMongoDao
    constructor(dao: VideoMongoDao){
        this.dao = dao
    }
   public async getAll(){
        return await this.dao.getAll()
    }

   public async create(params: object){
        return await this.dao.create(params)
    }

   public async find(id: Types.ObjectId) {
        return await this.dao.find(id)
    }
   public async update(id: string, params: any){
        return await this.dao.update(id, params)
    }

   public async delete(id: string){
        return await this.dao.delete(id)
    }

}

export default VideoStore