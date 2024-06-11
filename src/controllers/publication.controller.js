import Publication from "../models/Publication.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { uploadImage } from "../utils/cloudinary.js";
import fs from "fs-extra";

export const createPost = async (req, res) => {
    try {
        const { title, content, author } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({ message: "empty fields" });
        }

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
        const posts = await Publication.find().populate("author", "username");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
};

// Obtener una publicación por ID
export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Publication.findById(id).populate(
            "author",
            "username"
        );
        if (!post) {
            return res.status(404).json({ error: "Publication not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
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
