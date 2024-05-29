import { request } from "express";
import PostModel from "../models/PostModel.js";

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
        where: { id: req.params.id }
       })
       res.json(post[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

PostCTRL.createPost = async (req, res) => {
    console.log(req.body);
    try {
        await PostModel.create(req.body)
        res.json({"message": "Receta Creada correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

PostCTRL.updatePost = async (req, res) => {
    //console.log(req.body.id);
    try {
         await PostModel.update(req.body, {
            where: { id: req.body.id }
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