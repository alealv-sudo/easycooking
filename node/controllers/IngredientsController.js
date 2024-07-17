import IngredientsModel from "../models/IngredientsModel.js";

const ingredientsCTRL = {}

//* Metodos para el CRUD*//

//Mostrar todos los Registros
ingredientsCTRL.getAllIngredients = async (req, res) => {
    try {
       const Ingredients =  await IngredientsModel.findAll()
       res.json(Ingredients)
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Mostrart un registro

ingredientsCTRL.getIngredient = async (req, res) => {
    try {
       const Ingredient =  await IngredientsModel.findAll({
        where: { id: req.params.id }
       })
       res.json(Ingredient[0])
    } catch (error) {
       res.json({message: error.message}) 
    }
}

//Crear un registro

ingredientsCTRL.createIngredient = async (req, res) => {
    console.log("Ingredientes",req.body);
    try {
        await IngredientsModel.bulkCreate(req.body)
        res.json({"message": "Registro Creado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Actualizar un registro

ingredientsCTRL.updateIngredient = async (req, res) => {
    try {
         await IngredientsModel.update(req.body, {
            where: { id: req.params.id }
        })
        res.json({"message": "Registro Actualizado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

//Eliminar un registro

ingredientsCTRL.deleteIngredient = async (req , res) => {
    try {
        IngredientsModel.destroy({
            where:{recipeId: req.params.id}
        })
        res.json({"message": "Registro Eliminado correctamente"})
    } catch (error) {
        res.json({message: error.message}) 
    }
}

export default ingredientsCTRL