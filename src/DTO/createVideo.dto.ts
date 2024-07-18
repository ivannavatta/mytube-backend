import { ValidatePrivacy } from './../utils/validatePrivacy';
import { convertBytesToMegaBites } from './../utils/convertToMegaBite';
import { Types } from "mongoose"
import IVideo from "../entities/video.entiti"

export default class CreateVideoDto{
    user: Types.ObjectId
    originalName: string
    title: string
    size: number
    isPrivate?: boolean
    url: string
    constructor(newVideoInfo: IVideo, id: Types.ObjectId){
        this.user = id
        this.originalName = newVideoInfo.originalName
        this.title = newVideoInfo.title
        this.size = convertBytesToMegaBites(Number(newVideoInfo.size))
        this.isPrivate = ValidatePrivacy(newVideoInfo.isPrivate ?? 'public')
        this.url =  newVideoInfo.url
    }
}
