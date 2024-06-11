import { Schema, model } from "mongoose";

export const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    
},{
    versionKey: false,
    timestamps: true,
});

export default model("Comment", commentSchema);
