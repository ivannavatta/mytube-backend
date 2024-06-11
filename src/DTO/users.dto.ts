import { IUser } from "../entities/user.entiti"
import { createHash } from "../utils/cryptPassword.util"

class UserDto {
    firstName: string
    lastName: string
    email: string
    password: string
    constructor(newUserInfo: IUser){
        this.firstName = newUserInfo.firstName
        this.lastName = newUserInfo.lastName
        this.email = newUserInfo.email
        this.password = createHash(newUserInfo.password) 
    }
}

export default UserDto