import UserDto from "../DTO/users.dto";
import { ILogin, IUser } from "../entities/user.entiti";
import UserStore from "../stores/users.store";
import Login from "../useCases/loginUser.useCase";
import Register from "../useCases/registerUser.useCase";
import BaseInterface from "./baseInterface.service";

class UserService extends BaseInterface<UserStore> {
    private login: Login
    private register: Register
    constructor(store: UserStore){
        super(store)
        this.login = new Login(store)
        this.register = new Register(store)
    }
    
    public async create(params: IUser): Promise<any> {
        return await this.register.execute(params)
    }

    public async loginUser(params: ILogin): Promise<any> {
        return await this.login.execute(params)
    }

}

export default UserService