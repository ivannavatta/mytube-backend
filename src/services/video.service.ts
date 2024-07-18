import IVideo from "../entities/video.entiti";
import VideoStore from "../stores/video.store";
import CreateVideo from "../useCases/createVideo.useCase";
import FindUser from "../useCases/findUser.useCase";
import FindVideo from "../useCases/findVideo.useCase";
import GetVideos from "../useCases/getVideos.useCase";
import { GetUserVideos } from "../useCases/userVideos.useCase";
import BaseInterface from "./baseInterface.service";


export default class VideoService extends BaseInterface<VideoStore> {
    private getVideos: GetVideos
    private createVideo: CreateVideo
    private userVideos: GetUserVideos
    constructor(store: VideoStore, findUser: FindUser, findVideo: FindVideo) {
        super(store)
        this.getVideos = new GetVideos(store)
        this.createVideo = new CreateVideo(store, findUser, findVideo)
        this.userVideos = new GetUserVideos(store, findUser)
    }

    public async getUserVideos(email: string): Promise<any> {
        return await this.userVideos.execute(email)
    }

    public async getAllPublic(): Promise<any> {
        return await this.getVideos.execute()
    }

    public async create(params: IVideo): Promise<any> {
        return await this.createVideo.execute(params)
    }
}

