import UserMongoDao from "../DAO/mongo/usersMongo.dao"

class UserStore {
   public dao: UserMongoDao
    constructor(dao: UserMongoDao){
        this.dao = dao
    }
    async getAll(){
        return await this.dao.getAll()
    }

    async create(params: object){
        return await this.dao.create(params)
    }

    async find(id: string) {
        return await this.dao.find(id)
    }
    async update(id: string, params: any){
        return await this.dao.update(id, params)
    }

    async delete(id: string){
        return await this.dao.delete(id)
    }
}

export default UserStore