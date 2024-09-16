import { request } from "express";
import RecipeReviewModel from "../models/RecipeReviewModel.js";
import PostModel from "../models/PostModel.js"

const RecipeReviewCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
RecipeReviewCTRL.getAllPost = async (req, res) => {
    try {
       const post =  await RecipeReviewModel.findAll()
       res.json(post)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrar un registro

RecipeReviewCTRL.getPost = async (req, res) => {
    try {
       const post =  await RecipeReviewModel.findAll({
        where: { id: req.params.id },
        include: {model: PostModel}
       })
       res.json(post[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

RecipeReviewCTRL.createPost = async (req, res) => {
    try {
        const post = new RecipeReviewModel(req.body);
        await post.save();
        res.json(post)
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

RecipeReviewCTRL.updatePost = async (req, res) => {
    console.log("body", req.body);
    try {
         await RecipeReviewModel.update(req.body, {
            where: { id: req.body.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    } 
}

//Eliminar un registro

RecipeReviewCTRL.deletePost = async (req , res) => {
    try {
        RecipeReviewModel.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default RecipeReviewCTRL