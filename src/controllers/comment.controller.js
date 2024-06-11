import Comment from "../models/Comment.js";
import Publication from "../models/Publication.js";
import mongoose from "mongoose";

export const createComment = async (req, res) => {
    try {
        const { content, author, publication } = req.body;

        if (!content || !author || !publication) {
            return res
                .status(400)
                .json({
                    message: "Content, author, and publication are required",
                });
        }

        const publicationFound = await Publication.findById(publication);
        if (!publicationFound) {
            return res.status(404).json({ message: "Publication not found" });
        }

        const newComment = new Comment({ content, author, publication });
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: "Invalid Id" });
        }
        res.status(500).json({ message: "Something went wrong" });
        console.error(error);
    }
};

// Obtener comentarios por publicación
export const getCommentsByPublication = async (req, res) => {
    try {
        const { publicationId } = req.params;
        const comments = await Comment.find({
            publication: publicationId,
        }).populate("author", "username");
        res.status(200).json(comments);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: "Invalid Id" });
        }
        res.status(500).json({ message: "Something went wrong" });
        console.error(error);
    }
};
