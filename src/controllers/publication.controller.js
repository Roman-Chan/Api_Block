import Publication from "../models/Publication.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { uploadImage } from "../utils/cloudinary.js";
import fs from "fs-extra";
import { response } from "express";

export const createPost = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title)
            return res.status(400).json({ message: "Title is required" });
        if (!content)
            return res.status(400).json({ message: "Content is required" });

        if (!author)
            return res.status(400).json({ message: "Author is required" });

        const userFound = await User.findById(author);

        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }

        const newPublication = new Publication({ title, content, author });

        // Verificar si hay un archivo de imagen en la solicitud
        if (req.files && req.files.image) {
            const image = req.files.image;
            const resultImage = await uploadImage(image.tempFilePath);

            newPublication.image = {
                publicId: resultImage.public_id,
                secureUrl: resultImage.secure_url,
            };

            // Eliminar el archivo temporal
            fs.unlink(image.tempFilePath);
        }

        const publicationSave = await newPublication.save();
        res.status(201).json(publicationSave);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send({ message: "Invalid Id" });
        }
        res.status(500).json({ message: "something went wrong" });
        console.log(error);
    }
};

// Obtener todas las publicaciones
export const getAllPosts = async (req, res) => {
    try {
        const posts = await Publication.find()
            .populate("author", "username")
            .sort({ updatedAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
};



export const getPostById = async (req, res) => {
    try{

        const { id } = req.params;
        const post = await Publication.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Publication not found" });
        }

        return res.status(200).json(post);

    }catch(error){
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send({ message: "Invalid Id" });
        }
        return res.status(500).json({ message: "something went wrong" });
    }

}

export const getPostByIdUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });
        const post = await Publication.find({ author: id }).sort({updatedAt: -1});
        if (!post) {
            return res.status(404).json({ error: "Publication not found" });
        }

        const response = {
            data: {
                User: user,
                posts: post,
            },
        };

        return res.status(200).json(response);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError)
            return res.status(400).send({ message: "Invalid Id" });
        res.status(500).json({ message: "something went wrong" });
        console.log(error);
    }
};

// Actualizar una publicación por ID
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        const updatePublication = await Publication.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
            }
        );
        if (!updatePublication)
            return res.status(404).send({ message: "publication not found" });

        const response = {
            data: updatePublication,
        };
        res.status(200).json(response);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError)
            return res.status(400).send({ message: "Invalid Id" });
        res.status(500).json({ message: "Error al actualizar la publicación" });
    }
};

// Eliminar una publicación por ID
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Publication.findByIdAndDelete(id);
        if (!post) {
            return res.status(404).json({ message: "Publication not found" });
        }
        res.status(200).json({ message: "delete publication" });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).send({ message: "Invalid Id" });
        }
        res.status(500).json({ message: "Something went wrong" });
    }
};
