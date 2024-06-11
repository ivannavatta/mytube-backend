
import { IStore } from "../../entities/store.entiti";
import User from "./models/user.model";

class UserMongoDao implements IStore {
    async getAll(){
        return await User.find()
    }

    async create(params: object){
        return await User.create(params)
    }

    async find(id: string){
        return await User.findOne({email: id})
    }

    async update(id: string, params: any){
        return await User.updateOne({_id: id}, params)
    }

    async delete(id: string){
        return await User.updateOne({_id: id})
    }
    
}

export default UserMongoDao