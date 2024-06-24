import { Types } from "mongoose";
import VideoStore from "../stores/video.store";

export default class FindVideo {
    private store: VideoStore
    constructor(store: VideoStore){
        this.store = store
    }

    public async execute(email: Types.ObjectId) {
        const video = await this.store.find(email)
        return video
    }
}