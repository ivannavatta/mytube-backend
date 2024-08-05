import UserDto from "../DTO/users.dto";
import { IUser } from "../entities/user.entiti";
import UserStore from "../stores/users.store";


export default class Register {
    private store: UserStore
    constructor(store: UserStore){
        this.store = store
    }

    public async execute(params: IUser) {
        const {firstName, lastName, email, password} = params

        if(!firstName || !lastName || !email || !password) {
         throw new Error ('bad request')
        } 

        const userExist = await this.store.find(email)

        if(userExist){
            throw new Error('Email already exist')
        }
        const newUser = new UserDto(params)

        return await this.store.create(newUser)
    }
}