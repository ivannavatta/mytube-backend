import bcrypt from 'bcrypt'

export const createHash = (password: string) =>{
    const salt = bcrypt.genSaltSync(10)
    
    return bcrypt.hashSync(password, salt)
}

export const IsValidPassword = (user: string, password: string) => {
    return bcrypt.compareSync(password, user)
}

