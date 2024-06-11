import { Schema, model } from "mongoose";

export const PublicationSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            publicId: {
                type: String,
            },
            secureUrl: {
                type: String,
            },
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export default model("Publication", PublicationSchema);
