import mongoose from "mongoose";
const { ObjectId } = mongoose.Types

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    video: {
        type: ObjectId ,
        ref: 'video',
    }
})

export default userSchema