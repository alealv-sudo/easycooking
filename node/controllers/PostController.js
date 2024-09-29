import { request } from "express";
import PostModel from "../models/PostModel.js";
import RecipeReviewModel from "../models/RecipeReviewModel.js";
import IngredientsModel from "../models/IngredientsModel.js";
import GeneralPostModel from "../models/GeneralPostModel.js";
import { Op } from "sequelize";
import FavoriteRecipeModel from "../models/FavoriteRecipeModel.js";
import FollowerModels from "../models/FollowerModel.js";
import FollowedModels from "../models/FollowedModel.js";

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

/* Post paginados para el perfil de otros usuarios */

PostCTRL.getOterUserPostsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const userId = req.query.userId; // Get the userId from query parameters
        const userCurrent = req.query.userCurrent;

        // Calculate the offset
        const offset = (page - 1) * limit;

        console.log("hola");

        // Find posts with pagination
        const posts = await PostModel.findAll({
            where: {
                creatorId: userId
            },
            include: [
                {
                    model: IngredientsModel,
                    attributes: { exclude: ['id', 'recipeId'] }
                }
            ],
            offset: offset,
            limit: limit
        });

        // Find the total number of posts
        const totalPosts = await PostModel.count();

        // Add isLiked field to each post
        const postsWithLikes = await Promise.all(posts.map(async post => {
            const isLiked = await FavoriteRecipeModel.findOne({
                where: {
                    userId: userCurrent,
                    recipeId: post.id
                }
            });

            return {
                ...post.toJSON(), // Convert the post instance to a plain object
                isLiked: !!isLiked // Convert to boolean
            };
        }));

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts: totalPosts,
            posts: postsWithLikes
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

/* Post paginados del usuario */

PostCTRL.getPostsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const userId = req.query.userId; // Get the userId from query parameters
        const followeds = await FollowedModels.findAll({
            where: {
                userId: userId
            },
            attributes: ['followedId'] 
        });

        // If no followeds are found, return empty response
        if (!followeds.length) {
            return res.json({
                currentPage: page,
                totalPages: 0,
                totalPosts: 0,
                posts: []
            });
        }

        const followedIds = followeds.map(followed => followed.followedId);
        console.error(followedIds);
        // Calculate the offset
        
        const offset = (page - 1) * limit;

        console.error(followedIds,followedIds,followedIds)
        // Find posts with pagination
        const posts = await PostModel.findAll({ 
            where: {
                creatorId: {
                    [Op.in]: followedIds // Filter by creatorId in followedIds array
                }
            },
            offset: offset,
            limit: limit,
            order: [
                ['createdAt', 'DESC'] // Sort by date in descending order
            ],
            include: [
                {
                    model: IngredientsModel,
                    attributes: { exclude: ['id', 'recipeId'] }
                }
            ],
        });

        // Find recipe reviews with pagination
        const reviews = await RecipeReviewModel.findAll({
            where: {
                creatorId: {
                    [Op.in]: followedIds // Filter by creatorId in followedIds array
                }
            },
            offset: offset,
            limit: limit,
            order: [
                ['createdAt', 'DESC'] // Sort by date in descending order
            ]
        });

        // Find general posts with pagination
        const generalPost = await GeneralPostModel.findAll({
            where: {
                creatorId: {
                    [Op.in]: followedIds // Filter by creatorId in followedIds array
                }
            },
            offset: offset,
            limit: limit,
            order: [
                ['createdAt', 'DESC'] // Sort by date in descending order
            ]
        });

        // Find the total number of posts
        const totalPosts = await PostModel.count({
            where: {
                creatorId: {
                    [Op.in]: followedIds // Count only posts from followed creators
                }
            }
        });

        // Add isLiked field to each post
        const postsWithLikes = await Promise.all(posts.map(async post => {
            const isLiked = await FavoriteRecipeModel.findOne({
                where: {
                    userId: userId,
                    recipeId: post.id
                }
            });

            return {
                ...post.toJSON(), // Convert the post instance to a plain object
                isLiked: !!isLiked // Convert to boolean
            };
        }));

        // Combine posts, reviews, and general posts into one response array
        const response = [...postsWithLikes, ...reviews, ...generalPost]
        .filter(item => item.createdAt !== null) // Exclude items with null createdAt
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts: totalPosts,
            posts: response
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

//Mostrar un registro

PostCTRL.getPost = async (req, res) => {
    const userId = req.query.userId; // Get the userId from query parameters

    try {
       const posts =  await PostModel.findAll({
        where: { id: req.params.id },
        include: [{model: IngredientsModel ,attributes: {exclude: ['id','recipeId']}}]
       })
       
       // Add isLiked field to each post
       const postsWithLikes = await Promise.all([posts[0]].map(async post => {
        const isLiked = await FavoriteRecipeModel.findOne({
            where: {
                userId: userId,
                recipeId: post.id
            }
        });

        return {
            ...post.toJSON(), // Convert the post instance to a plain object
            isLiked: !!isLiked // Convert to boolean
        };
    }));

    res.json({
        post: postsWithLikes[0]
    });

    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrar un registros de un usuario

PostCTRL.getPostUser = async (req, res) => {
    try {
       const post =  await PostModel.findAll({
        where: {creatorId: req.params.id },
        include: [{model: IngredientsModel ,attributes: {exclude: ['id','recipeId']}}]
       })
       res.json(post)
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

// Mostrar lista de recetas por similitud de nombre
PostCTRL.getPostSimilar = async (req, res) => {
    const valueStyle = `%${req.params.value}%`
    
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        // const userId = req.query.userId; // Get the userId from query parameters

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Find posts with pagination
        const posts = await PostModel.findAll({
            where: {recipe_name: {[Op.iLike]: valueStyle}},
            include: [
                {
                    model: IngredientsModel,
                    attributes: { exclude: ['id', 'recipeId'] }
                }
            ],
            offset: offset,
            limit: limit
        });

        // Find the total number of posts
        const totalPosts = await PostModel.count();

        // Add isLiked field to each post
        const postsWithLikes = await Promise.all(posts.map(async post => {
            const isLiked = await FavoriteRecipeModel.findOne({
                where: {
                    recipeId: post.id
                }
            });

            return {
                ...post.toJSON(), // Convert the post instance to a plain object
                isLiked: !!isLiked // Convert to boolean
            };
        }));

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts: totalPosts,
            posts: postsWithLikes
        });
    } catch (error) {
        res.json({ message: error.message });
    }


};

// Mostrar lista de recetas por similitud de ingrediente
PostCTRL.getPostIngredientSimilar = async (req, res) => {
    const decodedURI = decodeURI(req.params.value);
    const valueStyle = decodedURI.split('*').map(ingredient => `%${ingredient.trim()}%`);

    console.log("Perro", valueStyle);


    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        // const userId = req.query.userId; // Get the userId from query parameters

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Find posts with pagination
        const posts = await PostModel.findAll({
            
            include: [
                {
                    model: IngredientsModel,
                    where: { ingredient: { [Op.or]: valueStyle.map(value => ({ [Op.iLike]: value })) } },
                    attributes: { exclude: ['id', 'recipeId'] }
                }
            ],
            group: ['recipes.id'],
            // having: sequelize.literal(`COUNT(DISTINCT Ingredients.ingredient) = ${valueStyle.length}`),
            order: [['createdAt', 'DESC']],
            offset: offset,
            limit: limit
        });

        // Find the total number of posts
        const totalPosts = await PostModel.count();

        // Add isLiked field to each post
        const postsWithLikes = await Promise.all(posts.map(async post => {
            const isLiked = await FavoriteRecipeModel.findOne({
                where: {
                    recipeId: post.id
                }
            });

            return {
                ...post.toJSON(), // Convert the post instance to a plain object
                isLiked: !!isLiked // Convert to boolean
            };
        }));

        res.json({
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts: totalPosts,
            posts: postsWithLikes
        });
    } catch (error) {
        res.json({ message: error.message });
    }
    
};

export default PostCTRL