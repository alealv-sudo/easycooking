import { request } from "express";
import GeneralPostModel from "../models/GeneralPostModel.js";
import { Op } from "sequelize";

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

/* Post paginados para el perfil de otros usuarios */
GeneralPostCTRL.getUserPostsPaginated = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = 12;
        const userId = req.query.userId; // Get the userId from query parameters
        const userCurrent = req.query.userCurrent;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Find posts with pagination
        const posts = await GeneralPostModel.findAll({
            where: {
                creatorId: userId
            },
            offset: offset,
            limit: limit,
            order: [
                ['createdAt', 'DESC'] // Sort by date in descending order
            ],
        });

        // Find the total number of posts
        const totalPosts = await GeneralPostModel.count({
            where: {
                creatorId: userId
            }
        });

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts: totalPosts,
            posts: posts
        });
    } catch (error) {
        res.json({ message: error.message });
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


GeneralPostCTRL.getPostsByUser = async (req, res) => {
    try {
       const post =  await GeneralPostModel.findAll({
        where: { creatorId: req.params.id }
       })
       res.json(post)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

// Mostrar lista de recetas por similitud de nombre
GeneralPostCTRL.getPostSimilar = async (req, res) => {
    const valueStyle = `%${req.params.value}%`
    
    try {
        // Find posts with pagination
        const generalPost = await GeneralPostModel.findAll({
            where: {
                title_post: {[Op.iLike]: valueStyle},
            },
            order: [
                ['createdAt', 'DESC'] // Sort by date in descending order
            ]
        });

        // Find the total number of posts
        const totalPosts = await GeneralPostModel.count({where: {
            title_post: {[Op.iLike]: valueStyle},
        }});

        res.json({
            currentPage: 1,
            totalPages: 1,
            totalPosts: totalPosts,
            posts: generalPost
        });
    } catch (error) {
        res.json({ message: error.message });
    }


};
export default GeneralPostCTRL