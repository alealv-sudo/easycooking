import { request } from "express";
import GeneralPostModel from "../models/GeneralPostModel.js";

const GeneralPostCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
GeneralPostCTRL.getAllPost = async (req, res) => {
    try {
       const post =  await GeneralPostModel.findAll()
       res.json(post)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrar un registro

GeneralPostCTRL.getPost = async (req, res) => {
    try {
       const post =  await GeneralPostModel.findAll({
        where: { id: req.params.id }
       })
       res.json(post[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

GeneralPostCTRL.createPost = async (req, res) => {
    try {
        const post = new GeneralPostModel(req.body);
        await post.save();
        res.json(post)
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

GeneralPostCTRL.updatePost = async (req, res) => {
    try {
         await GeneralPostModel.update(req.body, {
            where: { id: req.body.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    } 
}

//Eliminar un registro

GeneralPostCTRL.deletePost = async (req , res) => {
    try {
        GeneralPostModel.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default GeneralPostCTRL