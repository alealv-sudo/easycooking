import FavoriteRecipeModel from "../models/FavoriteRecipeModel.js"
import PostModel  from "../models/PostModel.js"
import IngredientsModel from "../models/IngredientsModel.js"

const FavoriteRecipeCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
FavoriteRecipeCTRL.getAllFavorites = async (req, res) => {
    try {
       const favorite =  await FavoriteRecipeModel.findAll()
       res.json(favorite)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

FavoriteRecipeCTRL.getFavorite = async (req, res) => {
    try {
       const favorite =  await FavoriteRecipeModel.findAll({
        where: { id: req.params.id }
       })
       res.json(favorite[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrar favoritos de un usuario

FavoriteRecipeCTRL.getUserFavorites = async (req, res) => {
    try {
       const favorite =  await FavoriteRecipeModel.findAll({
        where: { userId: req.params.id },
        include: [{model: PostModel, include:{model: IngredientsModel}}]
       })
       res.json(favorite)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

FavoriteRecipeCTRL.createFavorite = async (req, res) => {
    try {
        await FavoriteRecipeModel.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

FavoriteRecipeCTRL.updateFavorite = async (req, res) => {
    try {
         await FavoriteRecipeModel.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

FavoriteRecipeCTRL.deleteFavorite = async (req , res) => {
    try {
        FavoriteRecipeModel.destroy({
            where:{recipeId: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default FavoriteRecipeCTRL