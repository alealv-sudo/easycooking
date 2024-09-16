import RatingsModel from "../models/RatingsModel.js";

const ratingsCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
ratingsCTRL.getAllRatings  = async (req, res) => {
    try {
       const Rating  =  await RatingsModel.findAll()
       res.json(Rating)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

ratingsCTRL.getRating = async (req, res) => {
    try {
       const Rating  =  await RatingsModel.findAll({
        where: { id: req.params.id }
       })
       res.json(Rating[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

ratingsCTRL.getRatingUserRecipe = async (req, res) => {
    try {
       const Rating  =  await RatingsModel.findAll({
        where: { userId: req.params.userId, recipeId: req.params.recipeId }
       })
       res.json(Rating[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}


//Crear un registro

ratingsCTRL.createRating = async (req, res) => {
    try {
        await RatingsModel.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

ratingsCTRL.updateRating = async (req, res) => {
    try {
         await RatingsModel.update(req.body, {
            where: { id: req.body.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

ratingsCTRL.updateRatingReview = async (req, res) => {
    try {
         await RatingsModel.update(req.body, {
            where: { recipeId: req.body.recipeId, userId: req.body.userId }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}


//Eliminar un registro

ratingsCTRL.deleteRating = async (req , res) => {
    try {
        RatingsModel.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default ratingsCTRL