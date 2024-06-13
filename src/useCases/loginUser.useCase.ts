import { ILogin } from "../entities/user.entiti";
import UserStore from "../stores/users.store";
import { IsValidPassword } from "../utils/cryptPassword.util";

export default class Login {
    private store: UserStore
    constructor(store: UserStore){
        this.store = store
    }

    public async execute(params: ILogin) {
        const {email, password} = params

        const user = await this.store.find(email)

        if(!user) {
            throw new Error('Bad request')
        }
        if(!user.password) {
            throw new Error('Bad request')
        }

        const userPassword = user.password

        if(!IsValidPassword(userPassword, password))  {
            throw new Error('Bad request')
        }

        return 'User log in'
    }
}