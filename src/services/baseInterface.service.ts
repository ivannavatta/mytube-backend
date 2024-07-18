import { IStore } from "../entities/store.entiti"

abstract class BaseInterface<T extends IStore> {
    protected store: T
    constructor(store: T){
        this.store = store
    }
    public async getAll(): Promise<any>{
        return await this.store.getAll()
    }

    public async create(params: object): Promise<any>{
        return await this.store.create(params)
    }

    public async find(id: string): Promise<any>{
        return await this.store.find(id)
    }

    public async update(id: string, params: any): Promise<any>{
        return await this.store.update(id, params)
    }

    public async delete(id: string, videoId: string): Promise<any>{
        return await this.store.delete(id, videoId)
    }

}

export default BaseInterface