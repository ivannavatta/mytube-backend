import { IStore } from "../entities/store.entiti"

class BaseInterface<T extends IStore> {
    private store: T
    constructor(store: T){
        this.store = store
    }
    async getAll(){
        return await this.store.getAll()
    }

    async create(params: object){
        return await this.store.create(params)
    }

    async find(id: string){
        return await this.store.find(id)
    }

    async update(id: string, params: any){
        return await this.store.update(id, params)
    }

    async delete(id: string){
        return await this.store.delete(id)
    }

}

export default BaseInterface