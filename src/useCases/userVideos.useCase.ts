import VideoStore from "../stores/video.store";
import FindUser from "./findUser.useCase";

export class GetUserVideos {
    private store: VideoStore;
    private find: FindUser;

    constructor(store: VideoStore, find: FindUser) {
        this.store = store;
        this.find = find;
    }

    async execute(email: string): Promise<any> {
        const user = await this.find.execute(email);

        if (!user) {
            throw new Error('User not found');
        }

        const userId = user._id.toString();

        const videos = await this.store.getAll();

      
        const userVideosArray = videos.filter(videoData => videoData.user?.toString() === userId);

        const userVideos = userVideosArray.flatMap(videoData => videoData.videos);

        return userVideos;
    }
}

