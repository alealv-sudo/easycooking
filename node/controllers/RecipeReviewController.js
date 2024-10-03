import { request } from "express";
import RecipeReviewModel from "../models/RecipeReviewModel.js";
import PostModel from "../models/PostModel.js"
import { Op } from "sequelize";

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

/* Post paginados para el perfil de otros usuarios */
RecipeReviewCTRL.getUserPostsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit =  12;
        const userId = req.query.userId; // Get the userId from query parameters
        const userCurrent = req.query.userCurrent;

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Find posts with pagination
        const posts = await RecipeReviewModel.findAll({
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
        const totalPosts = await RecipeReviewModel.count({
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


RecipeReviewCTRL.getPostByUser = async (req, res) => {
    try {
       const post =  await RecipeReviewModel.findAll({
        where: { creatorId: req.params.id },
        include: {model: PostModel}
       })
       res.json(post)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

// Mostrar lista de recetas por similitud de nombre
RecipeReviewCTRL.getPostSimilar = async (req, res) => {
    const valueStyle = `%${req.params.value}%`
    
    try {
        // Find posts with pagination
        const reviews = await RecipeReviewModel.findAll({
            where: {
                title_post: {[Op.iLike]: valueStyle},
            },
            order: [
                ['createdAt', 'DESC'] // Sort by date in descending order
            ]
        });

        // Find the total number of posts
        const totalPosts = await RecipeReviewModel.count({where: {
            title_post: {[Op.iLike]: valueStyle},
        }});

        res.json({
            currentPage: 1,
            totalPages: 1,
            totalPosts: totalPosts,
            posts: reviews
        });
    } catch (error) {
        res.json({ message: error.message });
    }


};

export default RecipeReviewCTRL