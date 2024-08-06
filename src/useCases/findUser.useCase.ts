import UserStore from "../stores/users.store";

export default class FindUser {
    private store: UserStore
    constructor(store: UserStore){
        this.store = store
    }

    public async execute(email: string) {
        const user = await this.store.find(email)
        return user
    }
}
