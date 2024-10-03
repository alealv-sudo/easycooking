import LikeModel from "../models/LikeModel.js";
import PostModel from "../models/PostModel.js";
import IngredientsModel from "../models/IngredientsModel.js";
import FavoriteRecipeModel from "../models/FavoriteRecipeModel.js";

const LikeCTRL = {};

//* Metodos para el CRUD*//

//Mostrar todos los Registros
LikeCTRL.getAllLikes = async (req, res) => {
  try {
    const like = await LikeModel.findAll();
    res.json(like);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Mostrart un registro

LikeCTRL.getLike = async (req, res) => {
  try {
    const like = await LikeModel.findAll({
      where: { id: req.params.id },
    });
    res.json(like[0]);
  } catch (error) {
    res.json({ message: error.message });
  }
};

/* Regsitrso paginados de otros usuario */
LikeCTRL.getOterUserLikePaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const userId = req.query.userId; // Get the userId from query parameters
    const userCurrent = req.query.userCurrent;

    // Calculate the offset
    const offset = (page - 1) * limit;

    // Find posts with pagination
    const posts = await LikeModel.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: PostModel,
        },
      ],
      offset: offset,
      limit: limit,
      order: [
        [PostModel, "createdAt", "DESC"], // Ordenar los resultados del PostModel
      ]
    });

    // Find the total number of posts
    const totalPosts = await LikeModel.count({
      where: {
        userId: userId,
      },
    });

    // Add isLiked field to each post
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const isLiked = await LikeModel.findOne({
          where: {
            userId: userCurrent,
            recipeId: post.recipe.id,
          },
        });
        const isFaved = await FavoriteRecipeModel.findOne({
          where: {
            userId: userCurrent,
            recipeId: post.recipe.id,
          },
        });
        return {
          ...post.recipe.toJSON(), // Convert the post instance to a plain object
          isLiked: !!isLiked, // Convert to boolean
          isFaved: !!isFaved, // Convert to boolean
        };
      })
    );

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts: totalPosts,
      posts: postsWithLikes,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

///Muestra registros paginados

LikeCTRL.getPostsPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const userId = req.query.userId; // Get the userId from query parameters

    // Calculate the offset
    const offset = (page - 1) * limit;

    // Find posts with pagination
    const posts = await LikeModel.findAll({
      where: {
        userId: userId,
      },
      include: [
        {
          model: PostModel,
        },
      ],
      offset: offset,
      limit: limit,
      order: [
        [PostModel, "createdAt", "DESC"], // Ordenar los resultados del PostModel
      ]
    });

    // Find the total number of posts
    const totalPosts = await LikeModel.count({
      where: {
        userId: userId,
      },
    });

    // Add isLiked field to each post
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const isLiked = await LikeModel.findOne({
          where: {
            userId: userId,
            recipeId: post.recipe.id,
          },
        });
        const isFaved = await FavoriteRecipeModel.findOne({
          where: {
            userId: userId,
            recipeId: post.recipe.id,
          },
        });
        return {
          ...post.recipe.toJSON(), // Convert the post instance to a plain object
          isLiked: !!isLiked, // Convert to boolean
          isFaved: !!isFaved, // Convert to boolean
        };
      })
    );

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts: totalPosts,
      posts: postsWithLikes,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Mostrar favoritos de un usuario

LikeCTRL.getUserLikes = async (req, res) => {
  try {
    const like = await LikeModel.findAll({
      where: { userId: req.params.id },
      include: [{ model: PostModel, include: { model: IngredientsModel } }],
    });
    res.json(like);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Crear un registro

LikeCTRL.createLike = async (req, res) => {
  try {
    await LikeModel.create(req.body);
    res.json({ message: "Registro Creado correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Actualizar un registro

LikeCTRL.updateLike = async (req, res) => {
  try {
    await LikeModel.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: "Registro Actualizado correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Eliminar un registro

LikeCTRL.deleteLike = async (req, res) => {
  try {
    LikeModel.destroy({
      where: { recipeId: req.params.id },
    });
    res.json({ message: "Registro Eliminado correctamente" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

LikeCTRL.handleLikeClicked = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    const existingFavorite = await LikeModel.findOne({
      where: {
        userId: userId,
        recipeId: postId,
      },
    });

    if (existingFavorite) {
      // If the favorite exists, remove it and decrement the likes count
      await LikeModel.destroy({
        where: {
          userId: userId,
          recipeId: postId,
        },
      });

      await PostModel.decrement("likes", {
        by: 1,
        where: { id: postId },
      });

      return res.json({
        message: "Favorito eliminado y like decrementado",
        isLiked: false,
      });
    } else {
      // If the favorite doesn't exist, create it and increment the likes count
      await LikeModel.create({ userId, recipeId: postId });

      await PostModel.increment("likes", {
        by: 1,
        where: { id: postId },
      });

      return res.json({
        message: "Favorito creado y like incrementado",
        isLiked: true,
      });
    }
  } catch (error) {
    // Log the full error details to help diagnose the issue
    console.error("Validation error details:", error);
    res.status(400).json({ message: error.message });
  }
};

export default LikeCTRL;
