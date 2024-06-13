
import { IStore } from "../../entities/store.entiti";
import User from "./models/user.model";

class UserMongoDao implements IStore {
    public async getAll(){
        return await User.find()
    }

   public async create(params: object){
        return await User.create(params)
    }

   public async find(id: string){
        return await User.findOne({email: id})
    }

   public async update(id: string, params: any){
        return await User.updateOne({_id: id}, params)
    }

   public async delete(id: string){
        return await User.updateOne({_id: id})
    }
    
}

export default UserMongoDao