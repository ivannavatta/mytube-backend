import VideoStore from "../stores/video.store";

export default class GetVideos {
    private store: VideoStore
    constructor(store: VideoStore) {
       this.store = store
    }

    public async execute(): Promise<any> {
        const publicVideos = await this.store.getAll();

        const publicVideosFiltered = publicVideos.map(video => ({
            ...video,
            videos: video.videos.filter(v => !v.isPrivate)
        }));

        const videos = publicVideosFiltered.flatMap(video => video.videos);

        return videos;

        
    }
}