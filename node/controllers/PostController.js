import { request } from "express";
import PostModel from "../models/PostModel.js";
import IngredientsModel from "../models/IngredientsModel.js";

const PostCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
PostCTRL.getAllPost = async (req, res) => {
    try {
       const post =  await PostModel.findAll()
       res.json(post)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrar un registro

PostCTRL.getPost = async (req, res) => {
    try {
       const post =  await PostModel.findAll({
        where: { id: req.params.id },
        include: [{model: IngredientsModel ,attributes: {exclude: ['id','recipeId']}}]
       })
       res.json(post[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

PostCTRL.createPost = async (req, res) => {
    try {
        const post = new PostModel(req.body);
        await post.save();
        res.json(post)
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

PostCTRL.updatePost = async (req, res) => {
    try {
         await PostModel.update(req.body, {
            where: { id: req.body.recipe_id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    } 
}

//Eliminar un registro

PostCTRL.deletePost = async (req , res) => {
    try {
        PostModel.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default PostCTRL