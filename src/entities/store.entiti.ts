import { Types } from 'mongoose';
export interface IStore {
    getAll(): Promise<any>
    create(params: object): Promise<any>
    update(id: string, params: any): Promise<any>
    delete(id: string): Promise<any>
    find(id: (string | Types.ObjectId)): Promise<any>
}