export interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
}

export type ILogin = Omit<IUser, 'firstName' | 'lastName'>