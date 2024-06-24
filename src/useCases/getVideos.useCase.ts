import VideoStore from "../stores/video.store";

export default class GetVideos {
    private store: VideoStore
    constructor(store: VideoStore) {
       this.store = store
    }

    public async execute(): Promise<any> {
        return await this.store.getAll()
    }
}