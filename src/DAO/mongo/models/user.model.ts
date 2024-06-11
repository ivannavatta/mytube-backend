import mongoose from "mongoose";
import userSchema from "../schemas/user.schema";

const userCollection = 'user'

const User = mongoose.model(userCollection, userSchema)

export default User