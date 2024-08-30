import RecipeCommentsModels from "../models/RecipeCommentsModel.js"
import RecipeSubCommentsModels from "../models/RecipeSubCommentsModel.js"

const RecipeCommentsCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
RecipeCommentsCTRL.getAllRecipeComments = async (req, res) => {
    try {
       const RecipeComments =  await RecipeCommentsModels.findAll()
       res.json(RecipeComments)

       const RecipeSubComments =  await RecipeSubCommentsModels.findAll()
       res.json(RecipeSubComments)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

RecipeCommentsCTRL.getRecipeComments = async (req, res) => {
    try {
       const RecipeComments =  await RecipeCommentsModels.findAll({
        where: { id: req.params.id }
       })
       res.json(RecipeComments[0])

       const RecipeSubComments =  await RecipeSubCommentsModels.findAll({
        where: { id: req.params.id }
       })
       res.json(RecipeSubComments)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

RecipeCommentsCTRL.createRecipeComments = async (req, res) => {
    try {
        await RecipeCommentsModels.create(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

RecipeCommentsCTRL.updateRecipeComments = async (req, res) => {
    try {
         await RecipeCommentsModels.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

RecipeCommentsCTRL.deleteRecipeComments = async (req , res) => {
    try {
        RecipeCommentsModels.destroy({
            where:{id: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default RecipeCommentsCTRL