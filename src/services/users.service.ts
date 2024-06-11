import UserDto from "../DTO/users.dto";
import { ILogin, IUser } from "../entities/user.entiti";
import UserStore from "../stores/users.store";
import { IsValidPassword } from "../utils/cryptPassword.util";
import BaseInterface from "./baseInterface.service";

class UserService extends BaseInterface<UserStore> {
    constructor(store: UserStore){
        super(store)
    }
    
    async create(params: IUser): Promise<any> {
        const {firstName, lastName, email, password} = params

        if(!firstName || !lastName || !email || !password) {
         throw new Error ('bad request')
        } 
        const newUser = new UserDto(params)

        return await super.create(newUser)
    }

    async login(params: ILogin) {
        const {email, password} = params

        const user = await super.find(email)

        if(!user) {
            throw new Error('Bad request')
        }

        const userPassword = user.password

        if(!IsValidPassword(userPassword, password))  {
            throw new Error('Bad request')
        }

        return 'User log in'
    }

}

export default UserService