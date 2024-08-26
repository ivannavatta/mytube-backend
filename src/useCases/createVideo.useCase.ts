import CreateVideoDto from "../DTO/createVideo.dto";
import IVideo from "../entities/video.entiti";
import VideoStore from "../stores/video.store";
import FindUser from "./findUser.useCase";
import FindVideo from "./findVideo.useCase";


export default class CreateVideo {
    private store: VideoStore;
    private find: FindUser;
    private findVideo: FindVideo;

    constructor(store: VideoStore, findUser: FindUser, findVideo: FindVideo) {
        this.store = store;
        this.find = findUser;
        this.findVideo = findVideo;
    }

    async execute(params: IVideo): Promise<any> {
        const { email, originalName, title, size, isPrivate } = params;
        const user = await this.find.execute(email);
       
        if (!user) {
            throw new Error('User not found');
        }

        if (!originalName || !title || !size || !isPrivate) {
            throw new Error('bad request');
        }
        
        const userId = user._id;
        
        const newVideo = new CreateVideoDto(params, userId);
        
        const newVideoInfo = {
            originalName: newVideo.originalName,
            title: newVideo.title,
            size: newVideo.size,
            isPrivate: newVideo.isPrivate,
            url: newVideo.url,
            urlGCS: newVideo.urlGCS
        };
        
        const findVideo = await this.findVideo.execute(userId);

        if(findVideo && findVideo?.videos.length >= 2) {
            throw new Error('ya subiste tu maximo de videos')
        }
        
        const videoId = findVideo?.user?.toString();

        if (findVideo && userId.toString() === videoId) {
            findVideo.videos.push(newVideoInfo);
            findVideo.updatedAt = new Date()
            await findVideo.save();
            return findVideo;
        }

        const video = await this.store.create(newVideo);
        video.videos.push(newVideoInfo);
        await video.save();

        return video;
    }
}
